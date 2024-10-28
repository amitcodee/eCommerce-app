import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import  {combineReducers}  from "redux";
import  categoryDetail  from "./features/categorySlice";
import  sizeDetail  from "./features/sizeSlice";
import  colorDetail  from "./features/colorSlice";
import  productDetail  from "./features/productSlice";
import  reviewDetail  from "./features/reviewSlice";

const persistConfig = {
  key: "root",
  storage, // You can also use sessionStorage if you prefer
};

const rootReducer = combineReducers({
  size: sizeDetail, // State will be accessible under state.size
  color: colorDetail,
  product: productDetail,
  review: reviewDetail,
  category: categoryDetail,
  // Add other reducers here
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;
