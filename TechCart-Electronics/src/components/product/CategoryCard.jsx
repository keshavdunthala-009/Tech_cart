import { Link } from "react-router-dom";
import { getCategoryIcon } from "../../constants/categories";
import "./CategoryCard.css";

export default function CategoryCard({ category }) {
  const Icon = getCategoryIcon(category.slug);
  return (
    <Link to={`/products/${category.slug}`} className="category-card">
      <span className="category-icon">
        <Icon size={26} strokeWidth={1.75} />
      </span>
      <span className="category-name">{category.name}</span>
    </Link>
  );
}
