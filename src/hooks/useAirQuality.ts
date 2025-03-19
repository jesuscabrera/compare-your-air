// src/hooks/useAirQuality.ts
import { useState, useEffect } from "react";
import { City, CityAirQuality } from "../types/types";
import { getAirQualityForCity } from "../services/airQualityService";

export const useAirQuality = () => {
  // Initialize state from localStorage if available
  const [selectedCities, setSelectedCities] = useState<CityAirQuality[]>(() => {
    const savedCities = localStorage.getItem("selectedCities");
    return savedCities ? JSON.parse(savedCities) : [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save to localStorage whenever selectedCities changes
  useEffect(() => {
    localStorage.setItem("selectedCities", JSON.stringify(selectedCities));
  }, [selectedCities]);

  // Fetch air quality data for a selected city
  const fetchAirQualityData = async (city: City) => {
    setIsLoading(true);
    setError(null);

    try {
      const airQualityData = await getAirQualityForCity(city);
      return airQualityData;
    } catch (error) {
      console.error("Error fetching air quality data:", error);
      setError("Failed to fetch air quality data. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Select a city and fetch its air quality
  const handleCitySelect = async (city: City) => {
    if (selectedCities.some((c) => c.id === city.id)) {
      return;
    }

    const airQualityData = await fetchAirQualityData(city);
    if (airQualityData) {
      setSelectedCities((prev) => [...prev, airQualityData]);
    }
  };

  // Remove a city from the selected list
  const handleRemoveCity = (cityId: number) => {
    setSelectedCities((prev) => prev.filter((city) => city.id !== cityId));
  };

  // Retry fetching data (clears the error message)
  const handleRetry = () => {
    setError(null);
  };

  return {
    selectedCities,
    isLoading,
    error,
    handleCitySelect,
    handleRemoveCity,
    handleRetry,
  };
};
