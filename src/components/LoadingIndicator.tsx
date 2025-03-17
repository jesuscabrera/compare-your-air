// src/components/LoadingIndicator.tsx
import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { TEXTS } from "../locales/en";

const LoadingIndicator: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "top",
        mt: 2,
      }}
    >
      <CircularProgress color="secondary" />
      <Typography variant="h2">{TEXTS.loadingAirQuality}</Typography>
    </Box>
  );
};

export default LoadingIndicator;
