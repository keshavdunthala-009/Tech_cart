import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchAllUsers, deleteUser } from "../../api/authApi";
import { formatDate } from "../../utils/formatCurrency";
import Loader from "../../components/common/Loader";
import "./AdminTables.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllUsers()
      .then((res) => setUsers(res.data))
      .catch(() => toast.error("Could not load users"))
      .finally(() => setLoading(false));
  }, []);

  function handleDelete(id) {
    if (!window.confirm("Remove this user?")) return;
    deleteUser(id)
      .then(() => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        toast.success("User removed");
      })
      .catch(() => toast.error("Could not remove user"));
  }

  const customers = users.filter((u) => u.role === "customer");
  const admins = users.filter((u) => u.role === "admin");

  return (
    <div>
      <h1 className="section-title">Users ({users.length})</h1>
      <p className="text-muted" style={{ marginBottom: "var(--space-4)" }}>
        {customers.length} customers · {admins.length} admins
      </p>

      {loading ? (
        <Loader label="Loading users..." />
      ) : (
        <div className="admin-table-wrap card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>
                    <span className={`role-pill ${u.role}`}>{u.role}</span>
                  </td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>
                    <button className="btn btn-danger table-btn" onClick={() => handleDelete(u.id)}>
                      Remove
                    </button>
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
