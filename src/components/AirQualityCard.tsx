// src/components/AirQualityCard.tsx
import React from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface MetricInfo {
  name: string;
  value: number;
}

interface AirQualityCardProps {
  cityName: string;
  location: string;
  updatedTime: string;
  metrics: Record<string, number>;
  onClose: () => void;
}

const AirQualityCard: React.FC<AirQualityCardProps> = ({
  cityName,
  location,
  updatedTime,
  metrics,
  onClose,
}) => {
  const getMetricsInfo = (): MetricInfo[] => {
    return Object.entries(metrics).map(([key, value]) => ({
      name: key, // Using the raw key as the metric name
      value,
    }));
  };

  return (
    <Card
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: { xs: "100%", sm: 350 },
        marginBottom: 2,
      }}
    >
      <IconButton
        size="medium"
        onClick={onClose}
        aria-label="Close"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
        }}
      >
        <CloseIcon fontSize="medium" />
      </IconButton>

      <CardContent sx={{ paddingTop: 0 }}>
        <Typography
          variant="body2"
          component="div"
          sx={{ textTransform: "uppercase", textAlign: "left" }}
        >
          UPDATED {updatedTime}
        </Typography>
        <Typography
          variant="h6"
          component="div"
          color="primary"
          sx={{ fontWeight: 900, textAlign: "left" }}
        >
          {cityName}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, textAlign: "left" }}
        >
          in {location}, United Kingdom
        </Typography>

        <Typography variant="body2" fontWeight={600} sx={{ textAlign: "left" }}>
          &nbsp;Values:&nbsp;
          {getMetricsInfo().map((metric, i) => (
            <React.Fragment key={metric.name}>
              {metric.name}: {metric.value}
              {i < getMetricsInfo().length - 1 ? ", " : ""} &nbsp;
            </React.Fragment>
          ))}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AirQualityCard;
