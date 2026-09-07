import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchX } from "lucide-react";
import { searchProducts } from "../api/productApi";
import ProductCard from "../components/product/ProductCard";
import { ProductGridSkeleton } from "../components/common/Skeleton";
import "./CategoryListing.css";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    searchProducts(query)
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="container listing-page">
      <h1 className="section-title">Search results for "{query}"</h1>

      {loading && <ProductGridSkeleton count={8} />}

      {!loading && products.length === 0 && (
        <div className="empty-state">
          <SearchX size={48} strokeWidth={1.5} className="empty-icon" />
          <p>No products matched your search.</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
