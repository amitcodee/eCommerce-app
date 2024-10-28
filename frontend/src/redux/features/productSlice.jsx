import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching products
export const showProduct = createAsyncThunk(
  "productDetail/showProduct",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/products/get-products");
      
      // Ensure that response data is an array and contains the necessary fields
      if (Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        throw new Error("Invalid product data format");
      }
    } catch (error) {
      // Handle error responses and return the error message
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create slice with builder callback notation for extraReducers
export const productDetail = createSlice({
  name: "productDetail",
  initialState: {
    productDetail: [], // Store fetched products here
    loading: false,
    error: null,
    searchData: [], // Store search results here
  },

  reducers: {
    // Reducer for searching products (client-side filtering)
    searchProduct: (state, action) => {
      const searchTerm = action.payload.toLowerCase();
      state.searchData = state.productDetail.filter((product) =>
        product.name.toLowerCase().includes(searchTerm)
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(showProduct.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(showProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetail = action.payload; // Store fetched products in state
      })
      .addCase(showProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error in case of failure
      });
  },
});

// Export reducer and actions
export default productDetail.reducer;
export const { searchProduct } = productDetail.actions;
