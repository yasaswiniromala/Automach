import { createSlice } from "@reduxjs/toolkit";

//Defining the initial state here initially I am taking raw materials asa empty array
const initialState={
    rawMaterials: [],
};

// creating a slice 
//createSlice : 3 parameters name,initial state ,reducers key:value -> name of the reducer and function of the reducer itself

const rawMaterialSlice = createSlice({
    name: "rawMaterials",
    initialState,
    reducers: {
      addRawMaterial: (state, action) => {
        state.rawMaterials.push(action.payload);
      },
      updateRawMaterial: (state, action) => {
        const index = state.rawMaterials.findIndex(material => material.id === action.payload.id);
        if (index !== -1) {
          state.rawMaterials[index] = action.payload;
        }
      },
      deleteRawMaterial: (state, action) => {
        state.rawMaterials = state.rawMaterials.filter(material => material.id !== action.payload.id);
      },
    },
  });
  
  // Exporting actions
  export const { addRawMaterial, updateRawMaterial, deleteRawMaterial } = rawMaterialSlice.actions;
  
  // Exporting reducer
  export default rawMaterialSlice.reducer;
  