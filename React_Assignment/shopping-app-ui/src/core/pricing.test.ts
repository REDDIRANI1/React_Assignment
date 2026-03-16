import { BasketState } from "../features/basket/basketSlice";
import {
  OfferType,
  calculateOffers,
  calculateSubtotal,
  calculateTotals,
} from "./pricing";

const makeBasket = (items: Partial<BasketState["items"]>): BasketState => ({
  items: {
    bread: 0,
    milk: 0,
    cheese: 0,
    soup: 0,
    butter: 0,
    ...items,
  },
});

describe("pricing utilities", () => {
  it("calculates subtotal correctly", () => {
    const basket = makeBasket({ bread: 1, milk: 2, butter: 1 });
    // 1 * 110 + 2 * 50 + 1 * 120 = 330
    expect(calculateSubtotal(basket)).toBe(330);
  });

  it("applies cheese buy-one-get-one-free", () => {
    const basket = makeBasket({ cheese: 3 });
    const offers = calculateOffers(basket);
    const cheeseOffer = offers.find(
      (offer) => offer.offerType === OfferType.CheeseBOGO
    );
    // 3 cheese -> 1 free (90 pence)
    expect(cheeseOffer?.savingPence).toBe(90);
  });

  it("applies soup + bread half price offer", () => {
    const basket = makeBasket({ soup: 2, bread: 3 });
    const offers = calculateOffers(basket);
    const soupBreadOffer = offers.find(
      (offer) => offer.offerType === OfferType.SoupHalfPriceBread
    );
    // eligible breads = min(2, 3) = 2; bread is 110p so saving per loaf is 55p
    expect(soupBreadOffer?.savingPence).toBe(110);
  });

  it("applies butter third-off offer", () => {
    const basket = makeBasket({ butter: 3 });
    const offers = calculateOffers(basket);
    const butterOffer = offers.find(
      (offer) => offer.offerType === OfferType.ButterThirdOff
    );
    // butter is 120p -> 40p off each, 3 units => 120p saving
    expect(butterOffer?.savingPence).toBe(120);
  });

  it("combines multiple offers and computes total", () => {
    const basket = makeBasket({
      soup: 1,
      bread: 1,
      cheese: 2,
      butter: 1,
    });

    const summary = calculateTotals(basket);

    // Subtotal:
    // soup: 60, bread: 110, cheese: 2 * 90 = 180, butter: 120 => 470
    expect(summary.subtotalPence).toBe(470);

    // Savings:
    // soup+bread: half bread => 55
    // cheese BOGO: 1 cheese free => 90
    // butter third off: 40
    // total savings = 185
    expect(summary.savingsPence).toBe(185);
    expect(summary.totalPence).toBe(470 - 185);
  });
});

