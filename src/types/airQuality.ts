// src/types/airQuality.ts
export interface CityAirQuality {
  id: string;
  cityName: string;
  location: string;
  updatedTime: string;
  metrics: {
    PM25: number;
    SO2: number;
    O3: number;
    NO2: number;
  };
}
