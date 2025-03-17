// src/services/airQualityService.ts
import { CityAirQuality } from "../types/airQuality";
import { City } from "../types/city";
import { formatDistanceToNow } from "date-fns";

export const searchCities = async (query: string): Promise<City[]> => {
  try {
    const apiKey = import.meta.env.VITE_OPENAQ_API_KEY;
    const response = await fetch(
      "/api/v3/locations?limit=999&page=1&order_by=id&sort_order=asc&countries_id=79",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      return [];
    }
    const data = await response.json();
    console.log("Fetched cities:", data);

    // Group locations by locality
    const locationsByLocality: Record<string, any[]> = {};

    // First, filter and group all locations by locality
    data.results
      .filter((location: any) => !!location.locality)
      .forEach((location: any) => {
        const locality = location.locality;
        if (!locationsByLocality[locality]) {
          locationsByLocality[locality] = [];
        }
        locationsByLocality[locality].push(location);
      });

    // Then, for each locality, choose the location with the most recent data
    const dedupedCities = Object.entries(locationsByLocality).map(
      ([locality, locations]) => {
        // Sort locations by datetime (most recent first)
        const sortedLocations = locations.sort((a, b) => {
          const dateA = a.datetimeLast?.utc
            ? new Date(a.datetimeLast.utc)
            : new Date(0);
          const dateB = b.datetimeLast?.utc
            ? new Date(b.datetimeLast.utc)
            : new Date(0);
          return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
        });

        // Take the most recent one
        const mostRecentLocation = sortedLocations[0];

        // Convert to City type
        return {
          id: mostRecentLocation.id,
          name: mostRecentLocation.locality,
          location: mostRecentLocation.locality || mostRecentLocation.name,
          datetimeLast: mostRecentLocation.datetimeLast?.utc,
          sensors: mostRecentLocation.sensors.map((sensor: any) => ({
            id: sensor.id,
            name: sensor.name,
            parameter: sensor.parameter,
          })),
        };
      }
    );

    // Now filter by query
    const filteredCities = dedupedCities.filter((city: City) =>
      city.name.toLowerCase().includes(query.toLowerCase())
    );

    console.log("Filtered cities:", filteredCities);
    return filteredCities;
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
    console.log(`Air quality data for ${city.name}:`, data);

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

    console.log("Created metrics:", metrics);

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
