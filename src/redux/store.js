import { configureStore } from "@reduxjs/toolkit";
import rawMaterialReducer from "./reducers/rawMaterialSlice";

const store = configureStore({
  reducer: {
    rawMaterials: rawMaterialReducer,
  },
});

export default store;
