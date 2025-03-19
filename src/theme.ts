import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: { main: "#673ab7", light: "#9575cd", dark: "#512da8" },
    secondary: { main: "#3f51b5", light: "#7986cb", dark: "#303f9f" },
    background: { default: "#f5f5f5" },
    common: { black: "#000", white: "#fff" }, // Added white & black
    text: { primary: "#000", secondary: "#555" }, // Explicit text colors
  },
  typography: {
    fontFamily: "'Open Sans', sans-serif",
    h1: { fontSize: "3.2rem", fontWeight: 600, color: "white" },
    h2: { fontSize: "1.5rem", fontWeight: 400, color: "white", lineHeight: 2 },
    h5: {
      fontSize: "2rem",
      lineHeight: 1.8,
      fontWeight: 900,
      textAlign: "left",
    },
    body1: { fontSize: "1rem", color: "#000", textAlign: "left" },
    overline: {
      fontSize: "0.875rem",
      fontWeight: 600,
      color: "#000",
      textTransform: "uppercase",
      textAlign: "left",
      lineHeight: 1.5,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
          position: "relative",
          width: "100%",
          marginBottom: theme.spacing(2),
          [theme.breakpoints.up("sm")]: {
            maxWidth: 450, // Apply maxWidth only on small screens and above
          },
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "'Open Sans', sans-serif",
          borderRadius: 8,
          textTransform: "none",
          color: "#000",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: "#000",
        },
      },
    },
  },
});

// This single line automatically creates responsive typography
// that scales down on smaller screens
theme = responsiveFontSizes(theme);

export default theme;
