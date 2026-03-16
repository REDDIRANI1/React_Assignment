import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { productById } from "../../data/products";
import { calculateTotals } from "../../core/pricing";

export const selectBasketState = (state: RootState) => state.basket;

export const selectBasketItems = createSelector(selectBasketState, (basket) =>
  Object.entries(basket.items)
    .filter(([, quantity]) => quantity > 0)
    .map(([id, quantity]) => {
      const product = productById[id as keyof typeof productById];
      return { product, quantity };
    })
);

export const selectPricingSummary = createSelector(
  selectBasketState,
  (basket) => calculateTotals(basket)
);

