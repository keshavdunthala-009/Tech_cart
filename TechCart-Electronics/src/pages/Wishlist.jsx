import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Heart, X, ShoppingCart } from "lucide-react";
import { addToCart } from "../features/cart/cartSlice";
import { removeFromWishlist } from "../features/wishlist/wishlistSlice";
import { formatCurrency, discountPercent } from "../utils/formatCurrency";
import "./Wishlist.css";

export default function Wishlist() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.wishlist.items);

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <Heart size={48} strokeWidth={1.5} className="empty-icon" />
        <p>Your wishlist is empty.</p>
        <Link to="/" className="btn btn-primary">
          Explore Products
        </Link>
      </div>
    );
  }

  function handleMoveToCart(item) {
    dispatch(addToCart({ id: item.id, name: item.name, price: item.price, images: [item.image], brand: item.brand, stock: 99 }));
    dispatch(removeFromWishlist(item.id));
    toast.success(`${item.name} moved to cart`);
  }

  return (
    <div className="container wishlist-page">
      <h1 className="section-title">My Wishlist ({items.length})</h1>
      <div className="wishlist-grid">
        {items.map((item) => {
          const off = discountPercent(item.price, item.mrp);
          return (
            <div className="wishlist-card card" key={item.id}>
              <button
                className="wishlist-remove-btn"
                onClick={() => dispatch(removeFromWishlist(item.id))}
                aria-label="Remove from wishlist"
              >
                <X size={14} />
              </button>
              <Link to={`/product/${item.id}`} className="wishlist-card-img">
                <img src={item.image} alt={item.name} />
              </Link>
              <div className="wishlist-card-body">
                <span className="product-card-brand">{item.brand}</span>
                <Link to={`/product/${item.id}`} className="wishlist-card-name">
                  {item.name}
                </Link>
                <div className="product-card-price">
                  <span className="price-now">{formatCurrency(item.price)}</span>
                  {off > 0 && <span className="price-off">{off}% off</span>}
                </div>
                <button className="btn btn-primary btn-block" onClick={() => handleMoveToCart(item)}>
                  <ShoppingCart size={14} /> Move to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
