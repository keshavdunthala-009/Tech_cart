import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ShoppingCart, ArrowRight, Star, ShieldCheck } from "lucide-react";
import { fetchProducts } from "../api/productApi";
import { fetchCategories } from "../api/categoryApi";
import { fetchReviews } from "../api/reviewApi";
import { CATEGORIES } from "../constants/categories";
import ProductCard from "../components/product/ProductCard";
import CategoryCard from "../components/product/CategoryCard";
import Testimonials from "../components/product/Testimonials";
import { ProductGridSkeleton } from "../components/common/Skeleton";
import "./Home.css";

const FEATURED_SLUGS = ["mobiles", "laptops", "tvs", "game-consoles", "acs", "tabs"];

export default function Home() {
  const [categories, setCategories] = useState(CATEGORIES);
  const [productsBySlug, setProductsBySlug] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then((res) => {
        if (res.data?.length) setCategories(res.data);
      })
      .catch(() => {
        // fall back to the static CATEGORIES already in state
      });

    fetchReviews()
      .then((res) => setReviews(res.data))
      .catch(() => setReviews([]));

    fetchProducts()
      .then((res) => {
        const grouped = {};
        FEATURED_SLUGS.forEach((slug) => {
          grouped[slug] = res.data
            .filter((p) => p.categorySlug === slug)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 4);
        });
        setProductsBySlug(grouped);
      })
      .catch(() => {
        setProductsBySlug({});
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="hero-badge">
              <CheckCircle2 size={14} /> Trusted by 50,000+ shoppers across India
            </span>
            <h1>
              New tech? <span className="hero-highlight">Delivered to your door.</span>
            </h1>
            <p>
              Genuine mobiles, laptops, TVs, ACs, tablets and game consoles — best prices, fast
              delivery, and easy returns you can count on.
            </p>
            <div className="hero-actions">
              <Link to="/products/mobiles" className="btn btn-accent">
                <ShoppingCart size={16} /> Shop Mobiles
              </Link>
              <a href="#categories" className="btn btn-outline-light">
                Browse Categories <ArrowRight size={16} />
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>50,000+</strong>
                <span>Happy Customers</span>
              </div>
              <div className="hero-stat">
                <strong>4.8 / 5</strong>
                <span>Average Rating</span>
              </div>
              <div className="hero-stat">
                <strong>24 hr</strong>
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>

          <div className="hero-media">
            <img
              className="hero-media-img"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Black_and_white_Playstation_5_base_edition_with_controller.png/500px-Black_and_white_Playstation_5_base_edition_with_controller.png"
              alt="Latest tech available on TechCart"
            />
            <div className="hero-float hero-float-top">
              <span className="hero-float-icon">
                <Star size={18} fill="currentColor" strokeWidth={0} />
              </span>
              <div>
                <strong>4.8 average rating</strong>
                <small>From 12,000+ reviews</small>
              </div>
            </div>
            <div className="hero-float hero-float-bottom">
              <span className="hero-float-icon hero-float-icon-success">
                <ShieldCheck size={18} strokeWidth={2} />
              </span>
              <div>
                <strong>100% Genuine Products</strong>
                <small>Brand warranty included</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container home-section" id="categories">
        <h2 className="section-title">Shop by Category</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </section>

      {loading ? (
        <section className="container home-section">
          <h2 className="section-title">Loading products...</h2>
          <ProductGridSkeleton count={4} />
        </section>
      ) : (
        FEATURED_SLUGS.map((slug) => {
          const items = productsBySlug[slug];
          if (!items || items.length === 0) return null;
          const label = categories.find((c) => c.slug === slug)?.name || slug;
          return (
            <section className="container home-section" key={slug}>
              <div className="home-section-head">
                <h2 className="section-title">Top in {label}</h2>
                <Link to={`/products/${slug}`} className="view-all-link">
                  View all →
                </Link>
              </div>
              <div className="product-grid">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          );
        })
      )}

      <Testimonials reviews={reviews} />
    </div>
  );
}
