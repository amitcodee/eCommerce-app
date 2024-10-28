import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching sizes
export const showSize = createAsyncThunk(
  "sizeDetail/showSize",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/size/get-sizes");
      console.log(response.data); // Make sure this logs an array
      return response.data; // Make sure this returns an array
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);



// Create slice with builder callback notation for extraReducers
export const sizeDetail = createSlice({
  name: "sizeDetail",
  initialState: {
    sizeDetail: [],
    loading: false,
    error: null,
    searchData: [],
  },

  reducers: {
    searchSize: (state, action) => {
      console.log(action.payload);
      state.searchData = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(showSize.pending, (state) => {
        state.loading = true;
      })
      .addCase(showSize.fulfilled, (state, action) => {
        state.loading = false;
        state.sizeDetail = action.payload;
      })
      .addCase(showSize.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});




export default sizeDetail.reducer;
export const { searchSize } = sizeDetail.actions;
