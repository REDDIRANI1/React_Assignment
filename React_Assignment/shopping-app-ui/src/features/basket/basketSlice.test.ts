import { addItem, basketReducer, clear, removeItem, setQuantity } from "./basketSlice";

describe("basketSlice reducers", () => {
  it("adds items to the basket", () => {
    const state = basketReducer(undefined, addItem("bread"));
    expect(state.items.bread).toBe(1);
  });

  it("removes items but does not go below zero", () => {
    let state = basketReducer(undefined, removeItem("milk"));
    expect(state.items.milk).toBe(0);

    state = basketReducer(state, addItem("milk"));
    state = basketReducer(state, removeItem("milk"));
    expect(state.items.milk).toBe(0);
  });

  it("sets quantity and clamps negative values to zero", () => {
    let state = basketReducer(undefined, setQuantity({ id: "cheese", quantity: 3 }));
    expect(state.items.cheese).toBe(3);

    state = basketReducer(state, setQuantity({ id: "cheese", quantity: -5 }));
    expect(state.items.cheese).toBe(0);
  });

  it("clears all quantities", () => {
    let state = basketReducer(
      undefined,
      setQuantity({ id: "soup", quantity: 2 })
    );
    state = basketReducer(state, clear());
    expect(Object.values(state.items).every((qty) => qty === 0)).toBe(true);
  });
});

