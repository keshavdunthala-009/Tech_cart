import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "techcart_location";

function loadLocation() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const initialState = {
  address: loadLocation(), // { label, lat, lon }
  status: "idle", // idle | loading | success | error
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    detectStart(state) {
      state.status = "loading";
    },
    detectSuccess(state, action) {
      state.status = "success";
      state.address = action.payload;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
    },
    detectError(state) {
      state.status = "error";
    },
  },
});

export const { detectStart, detectSuccess, detectError } = locationSlice.actions;
export default locationSlice.reducer;
