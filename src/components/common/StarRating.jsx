import { Star, StarHalf } from "lucide-react";

// Clean amber star display with half-star support. Renders nothing for invalid ratings.
export default function StarRating({ rating, size = 16, className = "" }) {
  const value = Number(rating);
  if (!Number.isFinite(value) || value <= 0) return null;

  const full = Math.floor(value);
  const fraction = value - full;
  const hasHalf = fraction >= 0.25 && fraction < 0.75;
  const fullCount = fraction >= 0.75 ? full + 1 : full;

  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      title={`${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => {
        if (i <= fullCount) {
          return (
            <Star key={i} size={size} className="text-amber-400 fill-amber-400" />
          );
        }
        if (hasHalf && i === fullCount + 1) {
          return (
            <span
              key={i}
              className="relative inline-flex shrink-0"
              style={{ width: size, height: size }}
            >
              <Star size={size} className="absolute inset-0 text-gray-300" />
              <StarHalf
                size={size}
                className="absolute inset-0 text-amber-400 fill-amber-400"
              />
            </span>
          );
        }
        return <Star key={i} size={size} className="text-gray-300" />;
      })}
    </span>
  );
}
