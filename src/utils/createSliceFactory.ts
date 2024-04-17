import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { DataSourceItem } from "../interfaces/datasource";
import { sanitizeDataSource } from "./sanitizeDataSource";
import { fetchData } from "../services/apiService";

interface DataSliceState {
  data: DataSourceItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DataSliceState = {
  data: [],
  isLoading: false,
  error: null,
};

export function createDataSlice(sliceName: string, dataSourceName: string) {
  const fetchDataAsync = createAsyncThunk(
    `fetch${sliceName}Data`,
    async (_, { rejectWithValue }) => {
      try {
        // Check if `window.Switchboard` is defined and use its data if available
        if (window.Switchboard?.dataSources?.[dataSourceName]) {
          const response = window.Switchboard.dataSources[dataSourceName];
          return sanitizeDataSource()(response);
        } else {
          // Fetch data using API service as fallback or local development
          const response = await fetchData(dataSourceName);
          return sanitizeDataSource()(response);
        }
      } catch (error) {
        // Return a error payload if an error occurs
        return rejectWithValue(
          `Failed to load ${sliceName.toLowerCase()} data`
        );
      }
    }
  );

  const dataSlice = createSlice({
    name: `${sliceName.toLowerCase()}Data`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchDataAsync.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(fetchDataAsync.fulfilled, (state, action) => {
          state.isLoading = false;
          state.data = action.payload;
        })
        .addCase(fetchDataAsync.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message ?? null;
        });
    },
  });

  return { reducer: dataSlice.reducer, fetchDataAsync };
}
