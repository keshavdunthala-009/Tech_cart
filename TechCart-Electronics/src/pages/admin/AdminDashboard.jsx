import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { fetchAllOrders } from "../../api/orderApi";
import { fetchAllUsers } from "../../api/authApi";
import { fetchProducts } from "../../api/productApi";
import { formatCurrency, formatDate } from "../../utils/formatCurrency";
import Loader from "../../components/common/Loader";
import "./AdminDashboard.css";

const PIE_COLORS = ["#1a56db", "#ff7a00", "#16a34a", "#d97706", "#dc2626", "#7c3aed", "#0891b2"];
const STATUS_COLORS = { Delivered: "#16a34a", Shipped: "#1a56db", Pending: "#d97706", Cancelled: "#dc2626" };

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAllOrders(), fetchAllUsers(), fetchProducts()])
      .then(([ordersRes, usersRes, productsRes]) => {
        setOrders(ordersRes.data);
        setUsers(usersRes.data);
        setProducts(productsRes.data);
      })
      .catch(() => {
        setOrders([]);
        setUsers([]);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading dashboard..." />;

  const validOrders = orders.filter((o) => o.status !== "Cancelled");
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const totalUsers = users.filter((u) => u.role === "customer").length;
  const unitsSold = validOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0);

  // Revenue by date (bar chart)
  const revenueByDate = {};
  validOrders.forEach((o) => {
    const label = formatDate(o.createdAt);
    revenueByDate[label] = (revenueByDate[label] || 0) + o.total;
  });
  const revenueChartData = Object.entries(revenueByDate)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Revenue by category (pie chart)
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
  const revenueByCategory = {};
  validOrders.forEach((o) => {
    o.items.forEach((item) => {
      const cat = productMap[item.productId]?.categorySlug || "other";
      revenueByCategory[cat] = (revenueByCategory[cat] || 0) + item.price * item.qty;
    });
  });
  const categoryChartData = Object.entries(revenueByCategory).map(([name, value]) => ({ name, value }));

  // Orders by status (pie chart)
  const statusCount = {};
  orders.forEach((o) => {
    statusCount[o.status] = (statusCount[o.status] || 0) + 1;
  });
  const statusChartData = Object.entries(statusCount).map(([name, value]) => ({ name, value }));

  return (
    <div className="admin-dashboard">
      <h1 className="section-title">Dashboard Overview</h1>

      <div className="stat-cards">
        <div className="stat-card card">
          <span className="stat-label">Total Revenue</span>
          <span className="stat-value">{formatCurrency(totalRevenue)}</span>
        </div>
        <div className="stat-card card">
          <span className="stat-label">Total Orders</span>
          <span className="stat-value">{totalOrders}</span>
        </div>
        <div className="stat-card card">
          <span className="stat-label">Active Users</span>
          <span className="stat-value">{totalUsers}</span>
        </div>
        <div className="stat-card card">
          <span className="stat-label">Units Sold</span>
          <span className="stat-value">{unitsSold}</span>
        </div>
        <div className="stat-card card">
          <span className="stat-label">Total Products</span>
          <span className="stat-value">{products.length}</span>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card card">
          <h3>Revenue by Date</h3>
          {revenueChartData.length === 0 ? (
            <p className="text-muted">No orders yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e3e7ee" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Bar dataKey="revenue" fill="#1a56db" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-card card">
          <h3>Revenue by Category</h3>
          {categoryChartData.length === 0 ? (
            <p className="text-muted">No orders yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryChartData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {categoryChartData.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-card card">
          <h3>Orders by Status</h3>
          {statusChartData.length === 0 ? (
            <p className="text-muted">No orders yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusChartData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {statusChartData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#6b7280"} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
