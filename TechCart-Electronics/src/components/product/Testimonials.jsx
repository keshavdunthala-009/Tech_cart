import { Star, BadgeCheck, Quote } from "lucide-react";
import { formatDate } from "../../utils/formatCurrency";
import "./Testimonials.css";

export default function Testimonials({ reviews }) {
  if (!reviews || reviews.length === 0) return null;

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section className="container home-section testimonials-section">
      <div className="testimonials-head">
        <h2 className="section-title">What Our Customers Say</h2>
        <div className="testimonials-summary">
          <Star size={16} fill="currentColor" strokeWidth={0} />
          <strong>{avgRating} / 5</strong>
          <span className="text-muted">from {reviews.length}+ verified reviews</span>
        </div>
      </div>

      <div className="testimonials-grid">
        {reviews.map((review) => (
          <article className="testimonial-card card" key={review.id}>
            <Quote size={22} className="testimonial-quote-icon" />
            <div className="testimonial-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < review.rating ? "currentColor" : "none"}
                  className={i < review.rating ? "star-filled" : "star-empty"}
                />
              ))}
            </div>
            <p className="testimonial-comment">"{review.comment}"</p>
            <div className="testimonial-footer">
              <div className="testimonial-avatar">{review.userName.charAt(0)}</div>
              <div className="testimonial-meta">
                <span className="testimonial-name">
                  {review.userName}
                  {review.verified && (
                    <BadgeCheck size={14} className="verified-icon" aria-label="Verified Purchase" />
                  )}
                </span>
                <span className="testimonial-product text-muted">
                  Bought {review.productName} · {formatDate(review.date)}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
