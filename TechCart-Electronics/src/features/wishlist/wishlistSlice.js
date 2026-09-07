import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "techcart_wishlist";

function loadWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const initialState = {
  items: loadWishlist(), // { id, name, price, mrp, image, brand, categorySlug }
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist(state, action) {
      const product = action.payload;
      const exists = state.items.find((i) => i.id === product.id);
      if (exists) {
        state.items = state.items.filter((i) => i.id !== product.id);
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          mrp: product.mrp,
          image: product.images?.[0],
          brand: product.brand,
          categorySlug: product.categorySlug,
        });
      }
      persist(state.items);
    },
    removeFromWishlist(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      persist(state.items);
    },
  },
});

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions;
export const selectWishlistIds = (state) => state.wishlist.items.map((i) => i.id);
export default wishlistSlice.reducer;
