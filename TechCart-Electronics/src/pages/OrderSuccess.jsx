import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, PackageX } from "lucide-react";
import { fetchOrderById } from "../api/orderApi";
import { formatCurrency, formatDate } from "../utils/formatCurrency";
import Loader from "../components/common/Loader";
import "./OrderSuccess.css";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderById(orderId)
      .then((res) => setOrder(res.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <Loader label="Fetching order details..." />;

  if (!order) {
    return (
      <div className="empty-state">
        <PackageX size={48} strokeWidth={1.5} className="empty-icon" />
        <p>We couldn't find this order.</p>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container order-success-page">
      <div className="order-success-card card">
        <CheckCircle2 size={52} strokeWidth={1.5} className="success-icon" />
        <h1>Order placed successfully!</h1>
        <p className="text-muted">Thank you for shopping with TechCart. Your order id is #{order.id}.</p>

        <div className="order-details">
          <div className="order-details-row">
            <span>Order Date</span>
            <span>{formatDate(order.createdAt)}</span>
          </div>
          <div className="order-details-row">
            <span>Delivery Address</span>
            <span>{order.address}</span>
          </div>
          <div className="order-details-row">
            <span>Payment Method</span>
            <span>{order.paymentMethod?.toUpperCase()}</span>
          </div>
          <div className="order-details-row">
            <span>Status</span>
            <span className="status-pill">{order.status}</span>
          </div>
        </div>

        <div className="order-items">
          {order.items.map((item) => (
            <div className="order-item-row" key={item.productId}>
              <img src={item.image} alt={item.name} />
              <span className="order-item-name">{item.name} × {item.qty}</span>
              <span>{formatCurrency(item.price * item.qty)}</span>
            </div>
          ))}
        </div>

        <div className="order-details-row summary-total">
          <span>Total Paid</span>
          <span>{formatCurrency(order.total)}</span>
        </div>

        <div className="order-success-actions">
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
          <Link to="/profile" className="btn btn-outline">
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
