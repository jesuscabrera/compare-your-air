// src/components/ErrorState.tsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: 6,
        color: "rgba(255, 255, 255, 0.7)",
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 60, mb: 2, color: "#f44336" }} />
      <Typography variant="h6" component="div" sx={{ fontWeight: 400 }}>
        Something went wrong
      </Typography>
      <Typography
        variant="body2"
        sx={{ mt: 1, mb: 3, maxWidth: 400, textAlign: "center" }}
      >
        {message}
      </Typography>
      {onRetry && (
        <Button
          variant="contained"
          color="secondary"
          onClick={onRetry}
          sx={{ color: "white" }}
        >
          Try Again
        </Button>
      )}
    </Box>
  );
};

export default ErrorState;
