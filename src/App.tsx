// src/App.tsx
import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import theme from "./theme";
import CitySearch from "./components/CitySearch";
import AirQualityCard from "./components/AirQualityCard";
import LoadingIndicator from "./components/LoadingIndicator";
import ErrorState from "./components/ErrorState";
import { CityAirQuality } from "./types/airQuality";
import { getAirQualityForCity } from "./services/airQualityService";
import { City } from "./types/city";

function App() {
  const [selectedCities, setSelectedCities] = useState<CityAirQuality[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCitySelect = async (city: City) => {
    if (selectedCities.some((c) => c.cityName.includes(city.name))) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const airQualityData = await getAirQualityForCity(city);
      console.log("Air quality data for city:", airQualityData);
      if (airQualityData) {
        setSelectedCities((prev) => [...prev, airQualityData]);
      } else {
        setError(`No air quality data available for ${city.name}`);
      }
    } catch (error) {
      console.error("Error fetching air quality data:", error);
      setError("Failed to fetch air quality data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCity = (cityId: string) => {
    setSelectedCities(selectedCities.filter((city) => city.id !== cityId));
  };

  const handleRetry = () => {
    setError(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          width: "100vw",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #673ab7 0%, #3f51b5 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: { xs: 2, md: 4 },
        }}
      >
        <Container
          sx={{
            textAlign: "center",
            maxWidth: "100%",
            width: "100%",
          }}
        >
          <Container component="section" sx={{ py: 4, minHeight: 300 }}>
            <Typography
              variant="h1"
              component="h1"
              sx={{ mb: 2, mt: { xs: 2, md: 4 } }}
            >
              Compare your Air
            </Typography>
            <Typography variant="h2" component="h2" sx={{ mb: 4 }}>
              Compare the air quality between cities in the UK.
              <br />
              Select cities to compare using the search tool below.
            </Typography>

            <Box sx={{ width: "100%" }}>
              <CitySearch onCitySelect={handleCitySelect} />
            </Box>
          </Container>

          <Container
            component="section"
            sx={{
              py: 4,
              minHeight: 300,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {isLoading ? (
              <LoadingIndicator />
            ) : error ? (
              <ErrorState message={error} onRetry={handleRetry} />
            ) : (
              <>
                {selectedCities.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      flexWrap: "wrap",
                      justifyContent: "center",
                      gap: 2,
                      mt: 4,
                    }}
                  >
                    {selectedCities.map((city) => (
                      <AirQualityCard
                        key={city.id}
                        cityName={city.cityName}
                        location={city.location}
                        updatedTime={city.updatedTime}
                        metrics={city.metrics}
                        onClose={() => handleRemoveCity(city.id)}
                      />
                    ))}
                  </Box>
                )}
              </>
            )}
          </Container>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
