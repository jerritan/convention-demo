import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../services/apiService";
import { RootState } from "../store";
import { DataItem } from "../interfaces/datasource";
import { sanitizeDataSource } from "../utils/sanitizeDataSource";

import { DATASOURCE_CNB } from "../config";

// Define a type for the slice state
interface cnbState {
  data: DataItem[];
  isLoading: boolean;
  error: string | null;
}

// Define the initial state using that type
const initialState: cnbState = {
  data: [],
  isLoading: false,
  error: null,
};

const TYPE_OF_FETCH_DATA = {
  local: 'local',
  remote: 'remote',
}

export const fetchCnbAsync = createAsyncThunk(
  "cnb/fetchCnbInfo",
  async () => {
    const type = TYPE_OF_FETCH_DATA.local;
    let sanitizedData: DataItem[] = [];

    if (type === TYPE_OF_FETCH_DATA.local) {
      const defaultCnbData = window.Switchboard?.dataSources?.[DATASOURCE_CNB];
      sanitizedData = sanitizeDataSource()(defaultCnbData ?? []);
    } else {
      const response = await fetchData(DATASOURCE_CNB);
      sanitizedData = sanitizeDataSource()(response);
    }

    return sanitizedData;
  }
);

export const cnbSlice = createSlice({
  name: "cnb",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCnbAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCnbAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchCnbAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      });
  },
});

export const cnb = (state: RootState) => state.cnb.data;

export default cnbSlice.reducer;
