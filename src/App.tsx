// src/App.tsx
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #673ab7 0%, #3f51b5 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 4,
        }}
      >
        <Typography variant="h1" component="h1" sx={{ mb: 2 }}>
          Compare your Air
        </Typography>
        <Typography
          variant="h2"
          component="h2"
          sx={{ mb: 4, textAlign: "center" }}
        >
          Compare the air quality between cities in the UK.
          <br />
          Select cities to compare using the search tool below.
        </Typography>

        {/* You'll add the search component and results here in the next steps */}
      </Box>
    </ThemeProvider>
  );
}

export default App;
