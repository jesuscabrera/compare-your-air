// src/services/airQualityService.ts
import { CityAirQuality } from "../types/airQuality";

// Mock air quality data for each city
const mockAirQualityData: Record<string, CityAirQuality> = {
  Manchester: {
    id: "manchester-piccadilly",
    cityName: "Manchester Piccadilly",
    location: "Manchester, United Kingdom",
    updatedTime: "UPDATED AN HOUR AGO",
    metrics: {
      PM25: 9,
      SO2: 32,
      O3: 8,
      NO2: 43,
    },
  },
  "Milton Keynes": {
    id: "milton-keynes",
    cityName: "Milton Keynes",
    location: "Milton Keynes, United Kingdom",
    updatedTime: "UPDATED 6 WEEKS AGO",
    metrics: {
      PM25: 9,
      SO2: 32,
      O3: 8,
      NO2: 43,
    },
  },
  London: {
    id: "london-central",
    cityName: "London Central",
    location: "London, United Kingdom",
    updatedTime: "UPDATED 2 HOURS AGO",
    metrics: {
      PM25: 12,
      SO2: 28,
      O3: 10,
      NO2: 48,
    },
  },
  Birmingham: {
    id: "birmingham-city",
    cityName: "Birmingham City",
    location: "Birmingham, United Kingdom",
    updatedTime: "UPDATED 3 HOURS AGO",
    metrics: {
      PM25: 8,
      SO2: 30,
      O3: 7,
      NO2: 39,
    },
  },
  Liverpool: {
    id: "liverpool-central",
    cityName: "Liverpool Central",
    location: "Liverpool, United Kingdom",
    updatedTime: "UPDATED 1 DAY AGO",
    metrics: {
      PM25: 7,
      SO2: 25,
      O3: 9,
      NO2: 35,
    },
  },
  Glasgow: {
    id: "glasgow-city",
    cityName: "Glasgow City",
    location: "Glasgow, United Kingdom",
    updatedTime: "UPDATED 45 MINUTES AGO",
    metrics: {
      PM25: 10,
      SO2: 35,
      O3: 11,
      NO2: 40,
    },
  },
  Newcastle: {
    id: "newcastle-central",
    cityName: "Newcastle Central",
    location: "Newcastle, United Kingdom",
    updatedTime: "UPDATED 30 MINUTES AGO",
    metrics: {
      PM25: 8,
      SO2: 29,
      O3: 9,
      NO2: 37,
    },
  },
  Sheffield: {
    id: "sheffield-city",
    cityName: "Sheffield City",
    location: "Sheffield, United Kingdom",
    updatedTime: "UPDATED 50 MINUTES AGO",
    metrics: {
      PM25: 9,
      SO2: 31,
      O3: 8,
      NO2: 42,
    },
  },
  Bristol: {
    id: "bristol-central",
    cityName: "Bristol Central",
    location: "Bristol, United Kingdom",
    updatedTime: "UPDATED 20 MINUTES AGO",
    metrics: {
      PM25: 7,
      SO2: 26,
      O3: 7,
      NO2: 33,
    },
  },
  Edinburgh: {
    id: "edinburgh-city",
    cityName: "Edinburgh City",
    location: "Edinburgh, United Kingdom",
    updatedTime: "UPDATED 40 MINUTES AGO",
    metrics: {
      PM25: 6,
      SO2: 24,
      O3: 10,
      NO2: 30,
    },
  },
  Cardiff: {
    id: "cardiff-central",
    cityName: "Cardiff Central",
    location: "Cardiff, United Kingdom",
    updatedTime: "UPDATED 15 MINUTES AGO",
    metrics: {
      PM25: 8,
      SO2: 28,
      O3: 9,
      NO2: 38,
    },
  },
  "Mace Head": {
    id: "mace-head",
    cityName: "Mace Head",
    location: "Mace Head, United Kingdom",
    updatedTime: "UPDATED 2 DAYS AGO",
    metrics: {
      PM25: 5,
      SO2: 20,
      O3: 12,
      NO2: 25,
    },
  },
  "Market Harborough": {
    id: "market-harborough",
    cityName: "Market Harborough",
    location: "Market Harborough, United Kingdom",
    updatedTime: "UPDATED 3 DAYS AGO",
    metrics: {
      PM25: 7,
      SO2: 30,
      O3: 8,
      NO2: 34,
    },
  },
  Middlesbrough: {
    id: "middlesbrough",
    cityName: "Middlesbrough",
    location: "Middlesbrough, United Kingdom",
    updatedTime: "UPDATED 4 DAYS AGO",
    metrics: {
      PM25: 9,
      SO2: 33,
      O3: 10,
      NO2: 41,
    },
  },
};

export const searchCities = async (
  query: string
): Promise<{ id: number; name: string }[]> => {
  try {
    const apiKey = import.meta.env.VITE_OPENAQ_API_KEY;
    const response = await fetch(
      "/api/v3/locations?limit=100&page=1&order_by=id&sort_order=asc&countries_id=79",
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

    const filteredCities = data.results
      .map((location: any) => ({
        id: location.id,
        name: location.locality || location.name,
        location: location.name,
      }))
      .filter((city: { name: string }) =>
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
  city: string
): Promise<CityAirQuality | null> => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAirQualityData[city] || null);
    }, 800); // 800ms delay
  });
};
