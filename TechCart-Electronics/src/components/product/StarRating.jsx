import { Star } from "lucide-react";
import "./StarRating.css";

export default function StarRating({ rating = 0, count }) {
  return (
    <span className="star-rating">
      <span className="star-rating-badge">
        {rating.toFixed(1)} <Star size={11} className="star-icon" fill="currentColor" strokeWidth={0} />
      </span>
      {count != null && <span className="star-rating-count">({count})</span>}
    </span>
  );
}
