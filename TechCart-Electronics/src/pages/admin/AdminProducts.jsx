import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Plus, Star } from "lucide-react";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../../api/productApi";
import { CATEGORIES } from "../../constants/categories";
import { formatCurrency } from "../../utils/formatCurrency";
import Loader from "../../components/common/Loader";
import "./AdminTables.css";

const emptyForm = {
  name: "",
  brand: "",
  categorySlug: CATEGORIES[0].slug,
  price: "",
  mrp: "",
  stock: "",
  imageUrl: "",
  description: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  function loadProducts() {
    setLoading(true);
    fetchProducts()
      .then((res) => setProducts(res.data))
      .catch(() => toast.error("Could not load products"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      brand: product.brand,
      categorySlug: product.categorySlug,
      price: product.price,
      mrp: product.mrp,
      stock: product.stock,
      imageUrl: product.images?.[0] || "",
      description: product.description || "",
    });
    setModalOpen(true);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.brand.trim() || !form.price || !form.stock) {
      toast.error("Please fill name, brand, price and stock");
      return;
    }

    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      categorySlug: form.categorySlug,
      price: Number(form.price),
      mrp: Number(form.mrp) || Number(form.price),
      stock: Number(form.stock),
      images: [form.imageUrl || `https://loremflickr.com/480/480/${form.categorySlug}`],
      description: form.description || `${form.name} by ${form.brand}.`,
      rating: 4.2,
      ratingCount: 0,
      specs: {},
      unit: "",
    };

    setSaving(true);
    const request = editingId ? updateProduct(editingId, payload) : createProduct(payload);
    request
      .then(() => {
        toast.success(editingId ? "Product updated" : "Product added");
        setModalOpen(false);
        loadProducts();
      })
      .catch(() => {
        toast.error("Could not save product");
      })
      .finally(() => setSaving(false));
  }

  function handleDelete(id) {
    if (!window.confirm("Delete this product?")) return;
    deleteProduct(id)
      .then(() => {
        toast.success("Product deleted");
        setProducts((prev) => prev.filter((p) => p.id !== id));
      })
      .catch(() => toast.error("Could not delete product"));
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="admin-table-head">
        <h1 className="section-title">Products ({products.length})</h1>
        <div className="admin-table-actions">
          <input
            className="form-input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <Loader label="Loading products..." />
      ) : (
        <div className="admin-table-wrap card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img src={p.images?.[0]} alt={p.name} className="admin-table-img" />
                  </td>
                  <td>
                    <div className="admin-table-name">{p.name}</div>
                    <div className="text-muted">{p.brand}</div>
                  </td>
                  <td>{p.categorySlug}</td>
                  <td>{formatCurrency(p.price)}</td>
                  <td>{p.stock}</td>
                  <td className="rating-cell">
                    {p.rating} <Star size={12} fill="currentColor" strokeWidth={0} />
                  </td>
                  <td>
                    <button className="btn btn-outline table-btn" onClick={() => openEditModal(p)}>
                      Edit
                    </button>
                    <button className="btn btn-danger table-btn" onClick={() => handleDelete(p.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal card" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? "Edit Product" : "Add Product"}</h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input" name="name" value={form.name} onChange={handleChange} />
              </div>
              <div className="admin-row">
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input className="form-input" name="brand" value={form.brand} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" name="categorySlug" value={form.categorySlug} onChange={handleChange}>
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="admin-row">
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input className="form-input" type="number" name="price" value={form.price} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">MRP (₹)</label>
                  <input className="form-input" type="number" name="mrp" value={form.mrp} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock</label>
                  <input className="form-input" type="number" name="stock" value={form.stock} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input className="form-input" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} name="description" value={form.description} onChange={handleChange} />
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
