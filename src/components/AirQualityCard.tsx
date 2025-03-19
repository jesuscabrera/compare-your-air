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
      <Card>
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
          <Typography variant="overline" component="div">
            {TEXTS.updated} {updatedTime}
          </Typography>
          <Typography variant="h5" color="primary">
            {cityName}
          </Typography>
          <Typography
            variant="overline"
            component="div"
            sx={{ mb: 1, fontWeight: 400 }}
          >
            {TEXTS.locationPrefix} {location}, {TEXTS.country}
          </Typography>

          <Typography variant="body1" fontWeight={600}>
            <Typography component="span" fontWeight={600} sx={{ mr: 1 }}>
              {TEXTS.values}
            </Typography>
            {getMetricsInfo().map((metric, i) => (
              <React.Fragment key={metric.name}>
                <Typography
                  component="span"
                  fontWeight={600}
                  sx={{
                    display: "inline-block",
                    whiteSpace: "nowrap",
                    mr: 1,
                  }}
                >
                  {metric.name}: {metric.value}
                  {i < getMetricsInfo().length - 1 ? "," : ""}
                </Typography>
              </React.Fragment>
            ))}
          </Typography>
        </CardContent>
      </Card>
    </Grow>
  );
};

export default AirQualityCard;
