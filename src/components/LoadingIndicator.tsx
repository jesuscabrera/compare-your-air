// src/components/LoadingIndicator.tsx
import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingIndicator: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      <CircularProgress color="secondary" />
      <Typography variant="body2" color="white" sx={{ mt: 2 }}>
        Loading air quality data...
      </Typography>
    </Box>
  );
};

export default LoadingIndicator;
