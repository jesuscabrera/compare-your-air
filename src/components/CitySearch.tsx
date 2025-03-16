import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  InputAdornment,
  Box,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { searchCities } from "../services/airQualityService";

interface CitySearchProps {
  onCitySelect: (city: string) => void;
}

const CitySearch: React.FC<CitySearchProps> = ({ onCitySelect }) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        // If inputValue is empty, we assume searchCities("") returns *all* cities
        // Otherwise, it returns only matching cities.
        const results = await searchCities(inputValue);
        if (active) {
          setOptions(results.map((result) => result.name));
        }
      } catch (error) {
        console.error("Error searching cities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [inputValue]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
        px: { xs: 1, sm: 2, md: 0 },
      }}
    >
      <Autocomplete
        popupIcon={null}
        openOnFocus
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={options}
        loading={loading}
        disablePortal={true}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        onChange={(_, newValue) => {
          if (newValue) {
            onCitySelect(newValue);
            setInputValue("");
          }
        }}
        noOptionsText="No cities found"
        loadingText="Searching cities..."
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Enter city name..."
            variant="outlined"
            fullWidth
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}

                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              },
            }}
          />
        )}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#ffffff",
            borderRadius: 2,
            position: "relative",
          },
        }}
      />
    </Box>
  );
};

export default CitySearch;
