import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const showReview = createAsyncThunk(
  "reviewDetail/showReview",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/reviews/get-reviews");
      console.log(response.data); // Make sure this logs an array
      return response.data; // Make sure this returns an array
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

export const reviewDetail = createSlice({
  name: "reviewDetail",
  initialState: {
    reviewDetail: [],
    loading: false,
    error: null,
    searchData: [],
  },

  reducers: {
    searchReview: (state, action) => {
      console.log(action.payload);
      state.searchData = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(showReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(showReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewDetail = action.payload;
      })
      .addCase(showReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});



export default reviewDetail.reducer;
export const { searchReview } = reviewDetail.actions;