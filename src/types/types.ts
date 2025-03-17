export interface Location {
  id: number;
  locality?: string;
  name?: string;
  datetimeLast?: { utc?: string };
  sensors: { id: number; name: string; parameter: string }[];
}

export interface City {
  id: number;
  name: string;
  location: string;
  datetimeLast: string;
  sensors: {
    id: number;
    name: string;
    parameter: string;
  }[];
}

export interface CityAirQuality {
  id: string;
  cityName: string;
  location: string;
  updatedTime: string;
  metrics: Record<string, number>;
}
