// src/types/airQuality.ts
export interface CityAirQuality {
  id: string;
  cityName: string;
  location: string;
  updatedTime: string;
  metrics: Record<string, number>;
}
