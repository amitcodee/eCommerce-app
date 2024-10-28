import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const showColor = createAsyncThunk(
  "colorDetail/showColor",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/get-colors");
      console.log(response.data); // Make sure this logs an array
      return response.data; // Make sure this returns an array
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

export const colorDetail = createSlice({
  name: "colorDetail",
  initialState: {
    colorDetail: [],
    loading: false,
    error: null,
    searchData: [],
  },

  reducers: {
    searchColor: (state, action) => {
      console.log(action.payload);
      state.searchData = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(showColor.pending, (state) => {
        state.loading = true;
      })
      .addCase(showColor.fulfilled, (state, action) => {
        state.loading = false;
        state.colorDetail = action.payload;
      })
      .addCase(showColor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});



export default colorDetail.reducer;
export const { searchColor } = colorDetail.actions;