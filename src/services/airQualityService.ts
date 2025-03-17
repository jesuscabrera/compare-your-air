// src/services/airQualityService.ts
import { Location, City, CityAirQuality } from "../types/types";
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
    const locationsByLocality: Record<string, Location[]> = {};
    data.results
      .filter((location) => location.locality)
      .forEach((location) => {
        const locality = location.locality!;
        locationsByLocality[locality] = locationsByLocality[locality] || [];
        locationsByLocality[locality].push(location);
      });

    // Deduplicate cities by selecting the most recent location for each locality
    const dedupedCities: City[] = Object.entries(locationsByLocality).map(
      ([_, locations]) => {
        const mostRecentLocation = locations.reduce((latest, current) => {
          const currentDate = current.datetimeLast?.utc
            ? new Date(current.datetimeLast.utc)
            : new Date(0);
          const latestDate = latest.datetimeLast?.utc
            ? new Date(latest.datetimeLast.utc)
            : new Date(0);
          return currentDate > latestDate ? current : latest;
        });

        // Convert to City type
        return {
          id: mostRecentLocation.id,
          name: mostRecentLocation.locality ?? "Unknown",
          location:
            mostRecentLocation.locality ?? mostRecentLocation.name ?? "Unknown",
          datetimeLast: mostRecentLocation.datetimeLast?.utc ?? "N/A",
          sensors:
            mostRecentLocation.sensors?.map((sensor) => ({
              id: sensor.id,
              name: sensor.name,
              parameter: sensor.parameter,
            })) ?? [],
        };
      }
    );

    // Filter by query (case insensitive)
    if (!query.trim()) return dedupedCities;

    return dedupedCities.filter((city) =>
      city.name.toLowerCase().includes(query.toLowerCase())
    );
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
    const response = await fetch(
      `/api/v3/locations/${city.id}/latest?limit=100&page=1`,
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

    // Use the datetime from the API result - using the most recent measurement
    const latestMeasurement = data.results.reduce(
      (latest: any, current: any) => {
        if (
          !latest ||
          new Date(current.datetime.utc) > new Date(latest.datetime.utc)
        ) {
          return current;
        }
        return latest;
      },
      null
    );

    const updatedTime = formatDistanceToNow(
      new Date(latestMeasurement.datetime.utc),
      {
        addSuffix: true,
      }
    );

    // Create a map to store sensor information from the city object
    const sensorMap = new Map();
    if (city.sensors && Array.isArray(city.sensors)) {
      city.sensors.forEach((sensor) => {
        sensorMap.set(sensor.id, {
          name: sensor.name,
          parameter: sensor.parameter,
        });
      });
    }

    // Create metrics object using data from API results and sensor map
    const metrics: Record<string, number> = {};

    // Process each measurement from the API response
    data.results.forEach((measurement: any) => {
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
          measurement.datetime.utc > metrics[`${key}_datetime`]
        ) {
          metrics[key] = measurement.value.toFixed(2);
          metrics[`${key}_datetime`] = measurement.datetime.utc; // Store datetime for comparison
        }
      } else {
        // Fallback: use sensor ID as the key if no parameter info available
        const key = `SENSOR_${measurement.sensorsId}`;
        metrics[key] = measurement.value.toFixed(2);
      }
    });

    // Remove datetime temp properties used for comparison
    Object.keys(metrics).forEach((key) => {
      if (key.endsWith("_datetime")) {
        delete metrics[key];
      }
    });

    const cityAirQuality: CityAirQuality = {
      id: String(city.id),
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
