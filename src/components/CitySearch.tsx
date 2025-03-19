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

  /*
   * TODO: Consider using AbortController for request cancellation
   * Current 'active' flag prevents state updates but doesn't cancel network requests
   * Adding controller.abort() in cleanup would properly terminate in-flight fetches
   * Requires updating searchCities to accept and use an AbortSignal
   */

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
        // Fixed: Only set loading if still active
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [inputValue, searchCache]); // Fixed: Added searchCache dependency

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: 450 },
        mx: "auto",
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
                    <SearchIcon sx={{ color: "lightgray" }} />
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
            backgroundColor: "common.white",
            borderRadius: 2,
            position: "relative",
          },
        }}
      />
    </Box>
  );
};

export default CitySearch;
