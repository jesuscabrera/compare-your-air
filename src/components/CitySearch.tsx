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
import { City } from "../types/types";
import { TEXTS } from "../locales/en";

interface CitySearchProps {
  onCitySelect: (city: City) => void;
}

const CitySearch: React.FC<CitySearchProps> = ({ onCitySelect }) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  // Add the cache state
  const [searchCache, setSearchCache] = useState<Record<string, City[]>>({});

  useEffect(() => {
    let active = true;

    // Check cache before fetching
    if (searchCache[inputValue]) {
      setOptions(searchCache[inputValue]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const results = await searchCities(inputValue);
        if (active) {
          setOptions(results);
          // Update cache with new results
          setSearchCache((prev) => ({ ...prev, [inputValue]: results }));
        }
      } catch (error) {
        console.error("Error searching cities:", error);
      } finally {
        setLoading(false);
        console.log("Fetch data! Search Cities");
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [inputValue]); // Remove searchCache from dependencies

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 450,
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
        getOptionLabel={(option: City) => option.name}
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
        noOptionsText={TEXTS.noOptions}
        loadingText={TEXTS.loading}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={TEXTS.placeholder}
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
