import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { MapPin } from "lucide-react";
import { selectCartItems, selectCartTotal, clearCart } from "../features/cart/cartSlice";
import { createOrder } from "../api/orderApi";
import { validateAddress, validatePincode } from "../utils/validators";
import { formatCurrency } from "../utils/formatCurrency";
import "./Checkout.css";

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI" },
  { id: "card", label: "Credit / Debit Card" },
  { id: "cod", label: "Cash on Delivery" },
];

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const detectedLocation = useSelector((state) => state.location.address);

  const [address, setAddress] = useState(user?.address || "");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  function useDetectedLocation() {
    if (detectedLocation) {
      setAddress((prev) => (prev ? prev : detectedLocation.label));
      const match = detectedLocation.label.match(/\d{6}/);
      if (match) setPincode(match[0]);
      toast.info("Filled address from detected location");
    } else {
      toast.warn("Detect your location from the top bar first");
    }
  }

  function handlePlaceOrder(e) {
    e.preventDefault();
    const nextErrors = {
      address: validateAddress(address),
      pincode: validatePincode(pincode),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const order = {
      userId: user.id,
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        qty: i.qty,
        image: i.image,
      })),
      total,
      address: `${address.trim()}, ${pincode.trim()}`,
      paymentMethod,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    setPlacing(true);
    createOrder(order)
      .then((res) => {
        dispatch(clearCart());
        toast.success("Order placed successfully!");
        navigate(`/order-success/${res.data.id}`);
      })
      .catch(() => {
        toast.error("Could not place order. Please try again.");
      })
      .finally(() => {
        setPlacing(false);
      });
  }

  return (
    <div className="container checkout-page">
      <h1 className="section-title">Checkout</h1>

      <div className="checkout-layout">
        <form className="checkout-form card" onSubmit={handlePlaceOrder} noValidate>
          <h3>Delivery Address</h3>
          <button type="button" className="btn btn-outline use-location-btn" onClick={useDetectedLocation}>
            <MapPin size={15} /> Use detected location
          </button>

          <div className="form-group">
            <label className="form-label">Full Address</label>
            <textarea
              className={`form-input ${errors.address ? "invalid" : ""}`}
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House no, street, area, city"
            />
            {errors.address && <p className="form-error">{errors.address}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Pincode</label>
            <input
              className={`form-input ${errors.pincode ? "invalid" : ""}`}
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="560001"
            />
            {errors.pincode && <p className="form-error">{errors.pincode}</p>}
          </div>

          <h3>Payment Method</h3>
          <div className="payment-options">
            {PAYMENT_METHODS.map((pm) => (
              <label key={pm.id} className={`payment-option ${paymentMethod === pm.id ? "active" : ""}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={pm.id}
                  checked={paymentMethod === pm.id}
                  onChange={() => setPaymentMethod(pm.id)}
                />
                {pm.label}
              </label>
            ))}
          </div>

          <button className="btn btn-accent btn-block" type="submit" disabled={placing}>
            {placing ? "Placing Order..." : `Place Order · ${formatCurrency(total)}`}
          </button>
        </form>

        <aside className="checkout-summary card">
          <h3>Order Summary</h3>
          {items.map((i) => (
            <div className="checkout-summary-row" key={i.productId}>
              <span>
                {i.name} × {i.qty}
              </span>
              <span>{formatCurrency(i.price * i.qty)}</span>
            </div>
          ))}
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
