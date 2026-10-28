import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { addToCart, formatCurrency } from "@/lib/checkout";

export const Route = createFileRoute("/")({
  validateSearch: z.object({ q: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "mavlonebook — Ebooks & Paperbacks" },
      { name: "description", content: "Discover handpicked ebooks and paperbacks at mavlonebook." },
    ],
  }),
  component: Index,
});

function BookCard({ book, buyHref, className = "" }: { book: Book; buyHref?: string; className?: string }) {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart({
      id: book.id,
      title: book.title,
      author: book.author,
      price: Number(book.price || 0),
      cover_url: book.cover_url,
      format: book.format,
      type: book.format === "paperback" ? "print" : book.format,
    });
    navigate({ to: "/cart" });
  };

  return (
    <div className={`group relative flex flex-col rounded-2xl border bg-card p-3 transition duration-300 hover:-translate-y-1 hover:shadow-lift ${className}`}>
      <Link to="/book/$id" params={{ id: book.id }} className="absolute inset-0 z-10 rounded-2xl" aria-label={book.title} />
      <div className="pointer-events-none">
        <BookCover book={book} />
        <p className="mt-3 truncate text-sm font-bold">{book.title}</p>
        <Stars rating={book.rating} count={book.rating_count} className="mt-1" />
      </div>
      <div className="relative z-20 mt-auto flex items-center justify-between pt-2">
        <p className="pointer-events-none text-sm">
          <span className="font-extrabold">{formatPrice(book.price)}</span>
          {book.old_price && (
            <span className="ml-1.5 text-xs text-muted-foreground line-through">{formatPrice(book.old_price)}</span>
          )}
        </p>
        <div className="flex gap-2">
          {buyHref && (
            <a href={buyHref} target="_blank" rel="noreferrer" aria-label={`Buy ${book.title}`} className="rounded-full border bg-card p-2.5 transition hover:bg-primary hover:text-primary-foreground pointer-events-auto">
              <ShoppingBag className="h-4 w-4" />
            </a>
          )}
          <button type="button" onClick={handleAddToCart} className="pointer-events-auto rounded-full border bg-card px-2.5 py-2 text-xs font-semibold transition hover:bg-secondary">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
