// src/types/city.ts
export interface City {
  id: number;
  name: string;
  location: string;
  datetimeLast: string;
  sensors: {
    id: number;
    name: string;
    parameter: any;
  }[];
}
