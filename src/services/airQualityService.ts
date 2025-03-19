// src/services/airQualityService.ts
import { Location, City, CityAirQuality, Measurement } from "../types/types";
import { formatDistanceToNow } from "date-fns";

export const searchCities = async (query: string): Promise<City[]> => {
  try {
    // Retrieve API key and validate it
    const apiKey = import.meta.env.VITE_OPENAQ_API_KEY;
    if (!apiKey) {
      console.error("API key is missing.");
      return [];
    }

    // Construct query parameters dynamically
    const params = new URLSearchParams({
      limit: "999",
      page: "1",
      order_by: "id",
      sort_order: "asc",
      countries_id: "79",
    });

    // Fetch data from API
    const response = await fetch(`/api/v3/locations?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    // Handle API errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      return [];
    }

    // Parse JSON response
    const data: { results?: Location[] } = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      console.error("Invalid data format:", data);
      return [];
    }

    // Group locations by locality
    const locationsByLocality = data.results.reduce<Record<string, Location[]>>(
      (acc, location) => {
        if (!location.locality) return acc;
        (acc[location.locality] ||= []).push(location);
        return acc;
      },
      {}
    );

    // Deduplicate cities by selecting the most recent location for each locality
    const dedupedCities: City[] = Object.entries(locationsByLocality).map(
      ([_, locations]) => {
        const mostRecentLocation = locations.reduce((latest, current) =>
          new Date(current.datetimeLast?.utc || 0) >
          new Date(latest.datetimeLast?.utc || 0)
            ? current
            : latest
        );

        // Convert to City type
        return {
          id: mostRecentLocation.id,
          name: mostRecentLocation.locality ?? "Unknown",
          location:
            mostRecentLocation.locality ?? mostRecentLocation.name ?? "Unknown",
          datetimeLast: mostRecentLocation.datetimeLast?.utc ?? "N/A",
          sensors:
            mostRecentLocation.sensors?.map(({ id, name, parameter }) => ({
              id,
              name,
              parameter,
            })) ?? [],
        };
      }
    );

    // Filter by query (case insensitive)
    const trimmedQuery = query.trim();
    return trimmedQuery
      ? dedupedCities.filter((city) =>
          city.name.toLowerCase().includes(trimmedQuery.toLowerCase())
        )
      : dedupedCities;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};

export const getAirQualityForCity = async (
  city: City
): Promise<CityAirQuality | null> => {
  try {
    const apiKey = import.meta.env.VITE_OPENAQ_API_KEY;
    const params = new URLSearchParams({
      limit: "100",
      page: "1",
    });

    const response = await fetch(
      `/api/v3/locations/${city.id}/latest?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching air quality data:", errorText);
      return null;
    }

    const data = await response.json();

    // Check if we have results
    if (!data.results || data.results.length === 0) {
      console.error("No results found for city:", city.name);
      return null;
    }

    // Use the datetime from all the Sensors - using the most recent Sensor measurement
    const latestMeasurement = data.results.reduce(
      (latest: Measurement, current: Measurement) =>
        !latest ||
        new Date(current.datetime.utc) > new Date(latest.datetime.utc)
          ? current
          : latest,
      null
    );

    const updatedTime = latestMeasurement
      ? formatDistanceToNow(new Date(latestMeasurement.datetime.utc), {
          addSuffix: true,
        })
      : "No data available";

    // Create a map to store sensor information from the city object
    const sensorMap =
      city?.sensors?.reduce((map, sensor) => {
        return map.set(sensor.id, {
          name: sensor.name,
          parameter: sensor.parameter,
        });
      }, new Map()) || new Map();

    // Create metrics object using data from API results and sensor map
    const metrics: Record<string, number> = {};

    // Process each measurement from the API response
    data.results.forEach((measurement: Measurement) => {
      // Try to get sensor info from the sensor map
      const sensorInfo = sensorMap.get(measurement.sensorsId);

      if (sensorInfo && sensorInfo.parameter) {
        // Use parameter name from the sensor info as the key (in uppercase)
        const paramName =
          typeof sensorInfo.parameter === "string"
            ? sensorInfo.parameter
            : sensorInfo.parameter.name || "UNKNOWN";

        const key = paramName.toUpperCase();

        // Use the most recent value for each parameter type
        if (
          !metrics[key] ||
          !metrics[`${key}_datetime`] ||
          new Date(measurement.datetime.utc).getTime() >
            metrics[`${key}_datetime`]
        ) {
          metrics[key] = parseFloat(measurement.value.toFixed(2));
          metrics[`${key}_datetime`] = new Date(
            measurement.datetime.utc
          ).getTime();
        }
      } else {
        // Fallback: use sensor ID as the key if no parameter info available
        const key = `SENSOR_${measurement.sensorsId}`;
        metrics[key] = parseFloat(measurement.value.toFixed(2));
      }
    });

    // Remove datetime temp properties used for comparison
    Object.keys(metrics).forEach((key) => {
      if (key.endsWith("_datetime")) {
        delete metrics[key];
      }
    });

    const cityAirQuality: CityAirQuality = {
      id: city.id,
      cityName: city.name,
      location: city.location,
      updatedTime,
      metrics,
    };

    return cityAirQuality;
  } catch (error) {
    console.error("Error fetching air quality for city:", error);
    return null;
  }
};
