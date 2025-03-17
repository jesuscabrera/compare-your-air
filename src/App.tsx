// src/App.tsx
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
import { useAirQuality } from "./hooks/useAirQuality";

function App() {
  // Extracting air quality state and handlers from custom hook
  const {
    selectedCities,
    isLoading,
    error,
    handleCitySelect,
    handleRemoveCity,
    handleRetry,
  } = useAirQuality();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          width: "100vw",
          minHeight: "100dvh",
          background: "linear-gradient(135deg, #6b32a3 15%, #3f70a2 85%)",
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
          {/* HEADER SECTION */}
          <Container component="section" sx={{ py: 4, minHeight: 300 }}>
            <Typography
              variant="h1"
              component="h1"
              sx={{ mb: 4, mt: { xs: 2, md: 4 } }}
            >
              Compare your Air
            </Typography>
            <Typography variant="h2" component="h2" sx={{ mb: 0 }}>
              Compare the air quality between cities in the UK.
            </Typography>
            <Typography variant="h2" component="h2" sx={{ mb: 0 }}>
              Select cities to compare using the search tool below.
            </Typography>

            {/* CITY SEARCH COMPONENT */}
            <Box sx={{ width: "100%", my: 4 }}>
              <CitySearch onCitySelect={handleCitySelect} />
            </Box>
          </Container>

          {/* AIR QUALITY DISPLAY SECTION */}
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
            {/* CONDITIONAL RENDERING: LOADING, ERROR, OR CITY CARDS */}
            {isLoading && (
              <Box aria-live="polite">
                <LoadingIndicator />
              </Box>
            )}

            {error && (
              <Box aria-live="assertive">
                <ErrorState message={error} onRetry={handleRetry} />
              </Box>
            )}

            {!isLoading && !error && selectedCities.length > 0 && (
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
          </Container>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
