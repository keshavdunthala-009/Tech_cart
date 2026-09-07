import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PackageOpen } from "lucide-react";
import { fetchOrdersByUser } from "../api/orderApi";
import { formatCurrency, formatDate } from "../utils/formatCurrency";
import Loader from "../components/common/Loader";
import "./Profile.css";

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrdersByUser(user.id)
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user.id]);

  return (
    <div className="container profile-page">
      <div className="profile-header card">
        <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
        <div>
          <h1>{user.name}</h1>
          <p className="text-muted">{user.email}</p>
          <p className="text-muted">{user.phone}</p>
        </div>
      </div>

      <h2 className="section-title">My Orders</h2>

      {loading && <Loader label="Loading your orders..." />}

      {!loading && orders.length === 0 && (
        <div className="empty-state">
          <PackageOpen size={48} strokeWidth={1.5} className="empty-icon" />
          <p>You haven't placed any orders yet.</p>
        </div>
      )}

      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card card" key={order.id}>
            <div className="order-card-head">
              <span>Order #{order.id}</span>
              <span className="status-pill">{order.status}</span>
            </div>
            <p className="text-muted order-card-date">{formatDate(order.createdAt)}</p>
            {order.items.map((item) => (
              <div className="order-item-row" key={item.productId}>
                <img src={item.image} alt={item.name} />
                <span className="order-item-name">{item.name} × {item.qty}</span>
                <span>{formatCurrency(item.price * item.qty)}</span>
              </div>
            ))}
            <div className="order-details-row summary-total">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
