// src/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#673ab7",
      light: "#9575cd",
      dark: "#512da8",
    },
    secondary: {
      main: "#3f51b5",
      light: "#7986cb",
      dark: "#303f9f",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: "'Open Sans', sans-serif",
    h1: {
      fontSize: "2.2rem",
      fontWeight: 600,
      color: "#ffffff",
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 400,
      color: "#ffffff",
      lineHeight: 2,
    },
    body1: {
      fontSize: "1rem",
      color: "#000000",
    },
    body2: {
      fontSize: "0.875rem",
      color: "#000000",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          paddingTop: 16,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffff",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "#ffffff",
            border: "2px solid #ccc",
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          marginTop: 0,
        },
        option: {
          fontFamily: "'Open Sans', sans-serif",
          fontSize: "0.9rem",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& fieldset": {
            borderColor: "rgba(255, 255, 255, 0.3)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.5)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ffffff",
          },
        },
        input: {
          padding: "12px 14px",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: "'Open Sans', sans-serif",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "'Open Sans', sans-serif",
          borderRadius: 8,
          textTransform: "none",
          color: "#000000",
        },
      },
    },
  },
});

export default theme;
