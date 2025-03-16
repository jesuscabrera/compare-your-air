// src/components/AirQualityCard.tsx
import React from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface MetricInfo {
  name: string;
  value: number;
  description: string;
}

interface AirQualityCardProps {
  cityName: string;
  location: string;
  updatedTime: string;
  metrics: {
    PM25: number;
    SO2: number;
    O3: number;
    NO2: number;
  };
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
    return [
      {
        name: "PM2.5",
        value: metrics.PM25,
        description: "Fine particulate matter with diameter less than 2.5 μm",
      },
      {
        name: "SO₂",
        value: metrics.SO2,
        description: "Sulfur dioxide released from burning fossil fuels",
      },
      {
        name: "O₃",
        value: metrics.O3,
        description: "Ozone formed by reaction of pollutants with sunlight",
      },
      {
        name: "NO₂",
        value: metrics.NO2,
        description: "Nitrogen dioxide from vehicle exhaust and power plants",
      },
    ];
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
          {updatedTime}
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
          in {location}
        </Typography>

        <Typography variant="body2" fontWeight={600} sx={{ textAlign: "left" }}>
          Values:&nbsp;
          {getMetricsInfo().map((metric, i) => (
            <React.Fragment key={metric.name}>
              {metric.name}: {metric.value}
              {i < getMetricsInfo().length - 1 ? ", " : ""}
            </React.Fragment>
          ))}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AirQualityCard;
