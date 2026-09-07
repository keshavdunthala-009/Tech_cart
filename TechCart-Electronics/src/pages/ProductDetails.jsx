import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Heart, ShoppingCart, Zap, PackageX } from "lucide-react";
import { fetchProductById, fetchProductsByCategory } from "../api/productApi";
import { addToCart } from "../features/cart/cartSlice";
import { toggleWishlist, selectWishlistIds } from "../features/wishlist/wishlistSlice";
import { formatCurrency, discountPercent } from "../utils/formatCurrency";
import StarRating from "../components/product/StarRating";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/common/Loader";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistIds = useSelector(selectWishlistIds);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setActiveImage(0);
    fetchProductById(id)
      .then((res) => {
        setProduct(res.data);
        return fetchProductsByCategory(res.data.categorySlug);
      })
      .then((res) => {
        setRelated(res.data.filter((p) => String(p.id) !== String(id)).slice(0, 4));
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Loader label="Loading product..." />;

  if (error || !product) {
    return (
      <div className="empty-state">
        <PackageX size={48} strokeWidth={1.5} className="empty-icon" />
        <p>Product not found.</p>
      </div>
    );
  }

  const isWishlisted = wishlistIds.includes(product.id);
  const off = discountPercent(product.price, product.mrp);

  function handleAddToCart() {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart`);
  }

  function handleBuyNow() {
    dispatch(addToCart(product));
    navigate("/cart");
  }

  function handleWishlist() {
    dispatch(toggleWishlist(product));
    toast.info(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  }

  return (
    <div className="container details-page">
      <div className="details-layout">
        <div className="details-gallery">
          <div className="details-main-img">
            <img src={product.images[activeImage]} alt={product.name} />
          </div>
          <div className="details-thumbs">
            {product.images.map((img, i) => (
              <button
                key={i}
                className={`thumb-btn ${i === activeImage ? "active" : ""}`}
                onClick={() => setActiveImage(i)}
              >
                <img src={img} alt={`${product.name} ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="details-info">
          <span className="product-card-brand">{product.brand}</span>
          <h1 className="details-name">{product.name}</h1>
          <StarRating rating={product.rating} count={product.ratingCount} />

          <div className="details-price">
            <span className="price-now">{formatCurrency(product.price)}</span>
            {off > 0 && (
              <>
                <span className="price-mrp">{formatCurrency(product.mrp)}</span>
                <span className="price-off">{off}% off</span>
              </>
            )}
          </div>

          <p className={`stock-status ${product.stock > 0 ? "in-stock" : "out-stock"}`}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
          </p>

          <p className="details-description">{product.description}</p>

          <div className="details-actions">
            <button className="btn btn-primary" onClick={handleAddToCart} disabled={product.stock === 0}>
              <ShoppingCart size={16} /> Add to Cart
            </button>
            <button className="btn btn-accent" onClick={handleBuyNow} disabled={product.stock === 0}>
              <Zap size={16} /> Buy Now
            </button>
            <button
              className={`btn btn-outline wishlist-toggle-btn ${isWishlisted ? "active" : ""}`}
              onClick={handleWishlist}
            >
              <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
              {isWishlisted ? "Wishlisted" : "Wishlist"}
            </button>
          </div>

          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="details-specs">
              <h3>Specifications</h3>
              <table>
                <tbody>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <tr key={key}>
                      <td className="spec-key">{key}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="home-section">
          <div className="home-section-head">
            <h2 className="section-title">Related Products</h2>
            <Link to={`/products/${product.categorySlug}`} className="view-all-link">
              View all →
            </Link>
          </div>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
