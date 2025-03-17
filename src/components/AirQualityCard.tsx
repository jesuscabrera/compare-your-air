// src/components/AirQualityCard.tsx
import React from "react";
import { Card, CardContent, Typography, IconButton, Grow } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TEXTS } from "../locales/en";
import { useState } from "react";

/*  These interfaces are defined inside the component file because they are only 
 used within the component, if they are needed elsewhere in the application, 
 consider moving them to a shared types file (e.g., types.ts). */

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
      name: key,
      value,
    }));
  };

  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <Grow in={visible} timeout={500} onExited={onClose}>
      <Card
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: { xs: "100%", sm: 450 },
          marginBottom: 2,
        }}
      >
        <IconButton
          size="large"
          onClick={handleClose}
          aria-label="Close"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>

        <CardContent sx={{ my: 1, mx: 2 }}>
          <Typography
            variant="body2"
            component="div"
            sx={{ textTransform: "uppercase", textAlign: "left" }}
          >
            {TEXTS.updated} {updatedTime}
          </Typography>
          <Typography
            variant="h5"
            component="div"
            color="primary"
            sx={{ fontWeight: 900, textAlign: "left" }}
          >
            {cityName}
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 400, textAlign: "left" }}
          >
            {TEXTS.locationPrefix} {location}, {TEXTS.country}
          </Typography>

          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ textAlign: "left" }}
          >
            {TEXTS.values}&nbsp;
            {getMetricsInfo().map((metric, i) => (
              <React.Fragment key={metric.name}>
                {metric.name}: {metric.value}
                {i < getMetricsInfo().length - 1 ? ", " : ""} &nbsp;
              </React.Fragment>
            ))}
          </Typography>
        </CardContent>
      </Card>
    </Grow>
  );
};

export default AirQualityCard;
