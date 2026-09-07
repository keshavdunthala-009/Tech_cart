import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "techcart_cart";

function loadCart() {
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
  items: loadCart(), // { productId, name, price, image, brand, stock, qty }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existing = state.items.find((i) => i.productId === product.id);
      if (existing) {
        if (existing.qty < product.stock) existing.qty += 1;
      } else {
        state.items.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0],
          brand: product.brand,
          stock: product.stock,
          qty: 1,
        });
      }
      persist(state.items);
    },
    increment(state, action) {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item && item.qty < item.stock) item.qty += 1;
      persist(state.items);
    },
    decrement(state, action) {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item) item.qty -= 1;
      state.items = state.items.filter((i) => i.qty > 0);
      persist(state.items);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      persist(state.items);
    },
    clearCart(state) {
      state.items = [];
      persist(state.items);
    },
  },
});

export const { addToCart, increment, decrement, removeFromCart, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((n, i) => n + i.qty, 0);
export const selectCartTotal = (state) => state.cart.items.reduce((n, i) => n + i.qty * i.price, 0);

export default cartSlice.reducer;
