import { Star } from "lucide-react";

export function Stars({
  rating,
  count,
  className = "",
}: {
  rating: number | null | undefined;
  count?: number | null;
  className?: string;
}) {
  if (rating == null || rating <= 0) return null;
  const filled = Math.round(rating);
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className="inline-flex" aria-label={`Rated ${rating} out of 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${i < filled ? "fill-gold text-gold" : "text-gold/40"}`}
          />
        ))}
      </span>
      <span className="text-xs font-medium text-muted-foreground">
        {rating.toFixed(1)}
        {count != null && count > 0 ? ` (${count})` : ""}
      </span>
    </span>
  );
}
