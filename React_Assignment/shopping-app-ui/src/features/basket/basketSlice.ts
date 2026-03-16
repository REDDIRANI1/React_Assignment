import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type ProductId = "bread" | "milk" | "cheese" | "soup" | "butter";

export interface BasketState {
  items: Record<ProductId, number>;
}

const initialState: BasketState = {
  items: {
    bread: 0,
    milk: 0,
    cheese: 0,
    soup: 0,
    butter: 0,
  },
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<ProductId>) {
      const id = action.payload;
      state.items[id] = (state.items[id] ?? 0) + 1;
    },
    removeItem(state, action: PayloadAction<ProductId>) {
      const id = action.payload;
      const current = state.items[id] ?? 0;
      state.items[id] = current > 0 ? current - 1 : 0;
    },
    setQuantity(
      state,
      action: PayloadAction<{ id: ProductId; quantity: number }>
    ) {
      const { id, quantity } = action.payload;
      state.items[id] = quantity < 0 ? 0 : quantity;
    },
    clear(state) {
      Object.keys(state.items).forEach((key) => {
        const productId = key as ProductId;
        state.items[productId] = 0;
      });
    },
  },
});

export const { addItem, removeItem, setQuantity, clear } = basketSlice.actions;
export const basketReducer = basketSlice.reducer;

