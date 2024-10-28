import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const showCategory = createAsyncThunk(
  "categoryDetail/showCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/category");
      console.log(response.data); // Make sure this logs an array
      return response.data; // Make sure this returns an array
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

export const categoryDetail = createSlice({
  name: "categoryDetail",
  initialState: {
    categoryDetail: [],
    loading: false,
    error: null,
    searchData: [],
  },

  reducers: {
    searchCategory: (state, action) => {
      console.log(action.payload);
      state.searchData = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(showCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(showCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryDetail = action.payload;
      })
      .addCase(showCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});



export default categoryDetail.reducer;
export const { searchCategory } = categoryDetail.actions;