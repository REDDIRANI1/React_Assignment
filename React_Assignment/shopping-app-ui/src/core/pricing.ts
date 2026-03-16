import { BasketState, ProductId } from "../features/basket/basketSlice";
import { PRODUCTS, productById } from "../data/products";

export enum OfferType {
  CheeseBOGO = "CheeseBOGO",
  SoupHalfPriceBread = "SoupHalfPriceBread",
  ButterThirdOff = "ButterThirdOff",
}

export interface OfferSaving {
  offerType: OfferType;
  description: string;
  savingPence: number;
}

export interface PricingSummary {
  subtotalPence: number;
  savingsPence: number;
  totalPence: number;
  offers: OfferSaving[];
}

export const formatMoney = (pence: number): string =>
  `£${(pence / 100).toFixed(2)}`;

const getQuantity = (basket: BasketState, id: ProductId): number =>
  basket.items[id] ?? 0;

export const calculateSubtotal = (basket: BasketState): number => {
  return PRODUCTS.reduce((sum, product) => {
    const qty = getQuantity(basket, product.id);
    return sum + product.pricePence * qty;
  }, 0);
};

export const calculateOffers = (basket: BasketState): OfferSaving[] => {
  const offers: OfferSaving[] = [];

  // Cheese: buy one get one free (each pair -> one free)
  const cheeseQty = getQuantity(basket, "cheese");
  if (cheeseQty >= 2) {
    const cheese = productById.cheese;
    const freeUnits = Math.floor(cheeseQty / 2);
    const saving = freeUnits * cheese.pricePence;
    if (saving > 0) {
      offers.push({
        offerType: OfferType.CheeseBOGO,
        description: "Buy one Cheese, get second free",
        savingPence: saving,
      });
    }
  }

  // Soup + Bread: each Soup grants one half-price Bread
  const soupQty = getQuantity(basket, "soup");
  const breadQty = getQuantity(basket, "bread");
  const eligibleHalfPriceBread = Math.min(soupQty, breadQty);
  if (eligibleHalfPriceBread > 0) {
    const bread = productById.bread;
    const saving = Math.round((bread.pricePence / 2) * eligibleHalfPriceBread);
    offers.push({
      offerType: OfferType.SoupHalfPriceBread,
      description: "Buy Soup, get half price Bread",
      savingPence: saving,
    });
  }

  // Butter: one third off each Butter
  const butterQty = getQuantity(basket, "butter");
  if (butterQty > 0) {
    const butter = productById.butter;
    const savingPerUnit = Math.round(butter.pricePence / 3);
    const saving = savingPerUnit * butterQty;
    offers.push({
      offerType: OfferType.ButterThirdOff,
      description: "Get a third off Butter",
      savingPence: saving,
    });
  }

  return offers;
};

export const calculateTotals = (basket: BasketState): PricingSummary => {
  const subtotalPence = calculateSubtotal(basket);
  const offers = calculateOffers(basket);
  const savingsPence = offers.reduce((sum, offer) => sum + offer.savingPence, 0);
  const totalPence = subtotalPence - savingsPence;

  return {
    subtotalPence,
    savingsPence,
    totalPence,
    offers,
  };
};

