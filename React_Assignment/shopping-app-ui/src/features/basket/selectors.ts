import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { productById } from "../../data/products";
import { calculateTotals } from "../../core/pricing";

export const selectBasketState = (state: RootState) => state.basket;

export const selectBasketItems = createSelector(selectBasketState, (basket) => {
  const soupQty = basket.items.soup ?? 0;

  return Object.entries(basket.items)
    .filter(([, quantity]) => quantity > 0)
    .map(([id, quantity]) => {
      const typedId = id as keyof typeof productById;
      const product = productById[typedId];
      const lineSubtotalPence = product.pricePence * quantity;

      let savingsPence = 0;

      if (typedId === "cheese") {
        const freeUnits = Math.floor(quantity / 2);
        savingsPence = freeUnits * product.pricePence;
      } else if (typedId === "bread") {
        const eligibleHalfPriceBread = Math.min(quantity, soupQty);
        savingsPence = Math.round(
          (product.pricePence / 2) * eligibleHalfPriceBread
        );
      } else if (typedId === "butter") {
        const savingPerUnit = Math.round(product.pricePence / 3);
        savingsPence = savingPerUnit * quantity;
      }

      const lineTotalPence = lineSubtotalPence - savingsPence;

      return {
        product,
        quantity,
        lineSubtotalPence,
        savingsPence,
        lineTotalPence,
      };
    });
});

export const selectPricingSummary = createSelector(
  selectBasketState,
  (basket) => calculateTotals(basket)
);

