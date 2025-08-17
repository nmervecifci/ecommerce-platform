import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

interface CartState {
  items: CartItem[];
}

// LocalStorage'dan cart verilerini yükleme fonksiyonu
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const savedCart = localStorage.getItem("redux-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return [];
  }
};

// LocalStorage'a cart verilerini kaydetme fonksiyonu
const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("redux-cart", JSON.stringify(items));
    console.log("💾 Cart saved to localStorage:", items);
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

const initialState: CartState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
      console.log("🔥 Redux addToCart action called:", action.payload);

      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
        console.log("✅ Updated existing item quantity:", existingItem);
      } else {
        const newItem = { ...action.payload, quantity: 1 };
        state.items.push(newItem);
        console.log("✅ Added new item to cart:", newItem);
      }

      console.log("📦 New cart state:", state.items);
      saveCartToStorage(state.items);
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      console.log("🗑️ Redux removeFromCart action called:", action.payload);
      state.items = state.items.filter((item) => item.id !== action.payload);
      console.log("📦 New cart state after removal:", state.items);
      saveCartToStorage(state.items);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      console.log("🔄 Redux updateQuantity action called:", action.payload);
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item && quantity > 0) {
        item.quantity = quantity;
        console.log("✅ Updated item quantity:", item);
      } else if (item && quantity === 0) {
        state.items = state.items.filter((item) => item.id !== id);
        console.log("🗑️ Removed item with 0 quantity");
      }

      console.log("📦 New cart state after update:", state.items);
      saveCartToStorage(state.items);
    },

    clearCart: (state) => {
      console.log("🧹 Redux clearCart action called");
      state.items = [];
      console.log("📦 Cart cleared");
      saveCartToStorage(state.items);
    },

    // LocalStorage'dan cart'ı yeniden yükleme action'ı
    loadCart: (state) => {
      const loadedItems = loadCartFromStorage();
      state.items = loadedItems;
      console.log("📥 Cart loaded from localStorage:", loadedItems);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  loadCart,
} = cartSlice.actions;

export default cartSlice.reducer;
