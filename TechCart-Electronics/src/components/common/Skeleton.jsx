import "./Skeleton.css";

export function ProductCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-box skeleton-img" />
      <div className="skeleton-box skeleton-line" style={{ width: "80%" }} />
      <div className="skeleton-box skeleton-line" style={{ width: "50%" }} />
      <div className="skeleton-box skeleton-line" style={{ width: "40%" }} />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
