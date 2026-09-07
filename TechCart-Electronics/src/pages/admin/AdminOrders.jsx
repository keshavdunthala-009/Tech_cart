import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchAllOrders, updateOrderStatus } from "../../api/orderApi";
import { formatCurrency, formatDate } from "../../utils/formatCurrency";
import Loader from "../../components/common/Loader";
import "./AdminTables.css";

const STATUSES = ["Pending", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  function loadOrders() {
    setLoading(true);
    fetchAllOrders()
      .then((res) => setOrders(res.data))
      .catch(() => toast.error("Could not load orders"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadOrders();
  }, []);

  function handleStatusChange(id, status) {
    updateOrderStatus(id, status)
      .then(() => {
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
        toast.success("Order status updated");
      })
      .catch(() => toast.error("Could not update status"));
  }

  return (
    <div>
      <h1 className="section-title">Orders ({orders.length})</h1>

      {loading ? (
        <Loader label="Loading orders..." />
      ) : (
        <div className="admin-table-wrap card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{formatDate(o.createdAt)}</td>
                  <td>{o.items.length} item(s)</td>
                  <td>{formatCurrency(o.total)}</td>
                  <td>{o.paymentMethod?.toUpperCase()}</td>
                  <td>
                    <select
                      className="form-input status-select"
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
