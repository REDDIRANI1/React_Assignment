import React from "react";
import { PRODUCTS } from "./data/products";
import { useAppDispatch, useAppSelector } from "./hooks";
import { addItem, removeItem } from "./features/basket/basketSlice";
import {
  selectBasketItems,
  selectPricingSummary,
} from "./features/basket/selectors";
import { formatMoney } from "./core/pricing";
import "./App.css";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const basketItems = useAppSelector(selectBasketItems);
  const summary = useAppSelector(selectPricingSummary);

  return (
    <div className="app">
      <main className="app-main">
        <section className="panel panel-left">
          <h2>Products</h2>
          <ul className="list">
            {PRODUCTS.map((product) => (
              <li key={product.id} className="list-row">
                <span className="list-row-title">{product.name}</span>
                <div className="list-row-right">
                  <span className="list-row-price-main">
                    {formatMoney(product.pricePence)}
                  </span>
                  <button
                    className="btn btn-add"
                    onClick={() => dispatch(addItem(product.id))}
                  >
                    Add
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="panel panel-right">
          <h2>Basket</h2>
          {basketItems.length === 0 ? (
            <p className="muted">Your basket is empty.</p>
          ) : (
            <ul className="basket-list">
              {basketItems.map(
                ({
                  product,
                  quantity,
                  lineSubtotalPence,
                  savingsPence,
                  lineTotalPence,
                }) => (
                  <li key={product.id} className="basket-row">
                    <div className="basket-row-main">
                      <div className="basket-col-name">
                        <span className="basket-row-title">{product.name}</span>
                      </div>
                      <div className="basket-col-price">
                        <span className="basket-row-price-main">
                          {formatMoney(product.pricePence)}
                        </span>
                      </div>
                      <div className="basket-col-actions">
                        <div className="basket-row-qty">
                          <button
                            className="btn btn-icon"
                            onClick={() => dispatch(addItem(product.id))}
                          >
                            +
                          </button>
                          <span>{quantity}</span>
                          <button
                            className="btn btn-icon"
                            onClick={() => dispatch(removeItem(product.id))}
                          >
                            −
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="basket-row-details">
                      <div className="basket-row-line">
                        Item price {formatMoney(product.pricePence)} ×{" "}
                        {quantity} = {formatMoney(lineSubtotalPence)}
                      </div>
                      {savingsPence > 0 && (
                        <div className="basket-row-line savings">
                          Savings {formatMoney(savingsPence)}
                        </div>
                      )}
                      <div className="basket-row-line">
                        Item cost {formatMoney(lineTotalPence)}
                      </div>
                    </div>
                  </li>
                )
              )}
            </ul>
          )}

          <div className="totals">
            <div className="totals-row">
              <span>Sub Total:</span>
              <span>{formatMoney(summary.subtotalPence)}</span>
            </div>
            <div className="totals-row">
              <span>Savings:</span>
              <span className="savings">
                −{formatMoney(summary.savingsPence)}
              </span>
            </div>
            {summary.offers.length > 0 && (
              <ul className="offers">
                {summary.offers.map((offer) => (
                  <li key={offer.offerType}>
                    <span>{offer.description}</span>
                    <span className="savings">
                      −{formatMoney(offer.savingPence)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="totals-row totals-row-strong">
              <span>Total Amount:</span>
              <span>{formatMoney(summary.totalPence)}</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;

