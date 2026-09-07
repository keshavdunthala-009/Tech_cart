import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AlertTriangle, PackageSearch } from "lucide-react";
import { fetchProductsByCategory } from "../api/productApi";
import { CATEGORIES, getCategoryIcon } from "../constants/categories";
import ProductCard from "../components/product/ProductCard";
import { ProductGridSkeleton } from "../components/common/Skeleton";
import "./CategoryListing.css";

export default function CategoryListing() {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState("popularity");

  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  const CategoryIcon = getCategoryIcon(categorySlug);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setSelectedBrands([]);
    fetchProductsByCategory(categorySlug)
      .then((res) => {
        setProducts(res.data);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categorySlug]);

  const brands = useMemo(() => {
    return [...new Set(products.map((p) => p.brand))].sort();
  }, [products]);

  function toggleBrand(brand) {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  }

  const visibleProducts = useMemo(() => {
    let list = products;
    if (selectedBrands.length > 0) {
      list = list.filter((p) => selectedBrands.includes(p.brand));
    }
    list = [...list];
    if (sortBy === "price-low") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, selectedBrands, sortBy]);

  return (
    <div className="container listing-page">
      <div className="listing-head">
        <h1 className="section-title listing-title">
          {category && <CategoryIcon size={22} strokeWidth={1.75} />}
          {category ? category.name : "Products"}
        </h1>
        <select className="form-input sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="popularity">Sort: Popularity</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Customer Rating</option>
        </select>
      </div>

      <div className="listing-layout">
        <aside className="listing-filters card">
          <h3>Brand</h3>
          {brands.length === 0 && <p className="text-muted">No filters available</p>}
          {brands.map((brand) => (
            <label className="filter-checkbox" key={brand}>
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
              />
              {brand}
            </label>
          ))}
        </aside>

        <div className="listing-results">
          {loading && <ProductGridSkeleton count={8} />}

          {!loading && error && (
            <div className="empty-state">
              <AlertTriangle size={48} strokeWidth={1.5} className="empty-icon" />
              <p>Could not load products. Is json-server running on port 4500?</p>
            </div>
          )}

          {!loading && !error && visibleProducts.length === 0 && (
            <div className="empty-state">
              <PackageSearch size={48} strokeWidth={1.5} className="empty-icon" />
              <p>No products found in this category.</p>
            </div>
          )}

          {!loading && !error && visibleProducts.length > 0 && (
            <div className="product-grid">
              {visibleProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
