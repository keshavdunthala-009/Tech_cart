import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Heart, ShoppingCart } from "lucide-react";
import { addToCart } from "../../features/cart/cartSlice";
import { toggleWishlist, selectWishlistIds } from "../../features/wishlist/wishlistSlice";
import { formatCurrency, discountPercent } from "../../utils/formatCurrency";
import StarRating from "./StarRating";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlistIds = useSelector(selectWishlistIds);
  const isWishlisted = wishlistIds.includes(product.id);
  const off = discountPercent(product.price, product.mrp);

  function handleAddToCart(e) {
    e.preventDefault();
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart`);
  }

  function handleWishlist(e) {
    e.preventDefault();
    dispatch(toggleWishlist(product));
    toast.info(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  }

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <button
        type="button"
        className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
        onClick={handleWishlist}
        aria-label="Toggle wishlist"
      >
        <Heart size={16} strokeWidth={2} fill={isWishlisted ? "currentColor" : "none"} />
      </button>
      <div className="product-card-img">
        <img src={product.images?.[0]} alt={product.name} loading="lazy" />
      </div>
      <div className="product-card-body">
        <span className="product-card-brand">{product.brand}</span>
        <h3 className="product-card-name">{product.name}</h3>
        <StarRating rating={product.rating} count={product.ratingCount} />
        <div className="product-card-price">
          <span className="price-now">{formatCurrency(product.price)}</span>
          {off > 0 && (
            <>
              <span className="price-mrp">{formatCurrency(product.mrp)}</span>
              <span className="price-off">{off}% off</span>
            </>
          )}
        </div>
        {product.stock > 0 ? (
          <button className="btn btn-primary btn-block add-cart-btn" onClick={handleAddToCart}>
            <ShoppingCart size={14} /> Add to Cart
          </button>
        ) : (
          <button className="btn btn-block add-cart-btn" disabled>
            Out of Stock
          </button>
        )}
      </div>
    </Link>
  );
}
