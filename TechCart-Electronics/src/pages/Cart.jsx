import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import {
  selectCartItems,
  selectCartTotal,
  increment,
  decrement,
  removeFromCart,
} from "../features/cart/cartSlice";
import { formatCurrency } from "../utils/formatCurrency";
import "./Cart.css";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <ShoppingCart size={48} strokeWidth={1.5} className="empty-icon" />
        <p>Your cart is empty.</p>
        <Link to="/" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1 className="section-title">Your Cart ({items.length})</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div className="cart-item card" key={item.productId}>
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="cart-item-info">
                <span className="product-card-brand">{item.brand}</span>
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-price">{formatCurrency(item.price)}</p>
              </div>
              <div className="cart-item-qty">
                <button onClick={() => dispatch(decrement(item.productId))} aria-label="Decrease quantity">
                  <Minus size={14} />
                </button>
                <span>{item.qty}</span>
                <button
                  onClick={() => dispatch(increment(item.productId))}
                  disabled={item.qty >= item.stock}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
              <p className="cart-item-subtotal">{formatCurrency(item.price * item.qty)}</p>
              <button
                className="cart-item-remove"
                onClick={() => dispatch(removeFromCart(item.productId))}
                aria-label="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <aside className="cart-summary card">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span className="text-muted">Free</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <button className="btn btn-accent btn-block" onClick={() => navigate("/checkout")}>
            Proceed to Checkout <ArrowRight size={16} />
          </button>
        </aside>
      </div>
    </div>
  );
}
