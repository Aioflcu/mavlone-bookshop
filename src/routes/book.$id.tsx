import { createFileRoute, Link } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { addToCart, type CartItem, formatCurrency } from "@/lib/checkout";

export const Route = createFileRoute("/book/$id")({
  head: () => ({
    meta: [
      { title: "Book details — mavlonebook" },
      { name: "description", content: "Read about this book and buy it from mavlonebook." },
    ],
  }),
  component: BookPage,
});

function BookPage() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const { data: book, isLoading } = useQuery(bookQuery(id));
  const { data: settings } = useQuery(settingsQuery);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(timer);
  }, [added]);

  const buyHref = book ? buyHrefFor(book, settings) : undefined;

  const handleAddToCart = () => {
    if (!book) return;
    addToCart({
      id: book.id,
      title: book.title,
      author: book.author,
      price: Number(book.price || 0),
      cover_url: book.cover_url,
      format: book.format,
      type: book.format === "paperback" ? "print" : book.format,
    });
    setAdded(true);
  };

  const handleBuyNow = () => {
    if (!book) return;
    addToCart({
      id: book.id,
      title: book.title,
      author: book.author,
      price: Number(book.price || 0),
      cover_url: book.cover_url,
      format: book.format,
      type: book.format === "paperback" ? "print" : book.format,
    });
    navigate({ to: "/checkout" });
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 pt-10">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to store
        </Link>
        {isLoading ? (
          <p className="mt-10 text-muted-foreground">Loading…</p>
        ) : !book ? (
          <p className="mt-10">This book isn't available.</p>
        ) : (
          <div className="mt-8 grid gap-10 md:grid-cols-[320px_1fr]">
            <div className="mx-auto w-56 md:w-full"><BookCover book={book} /></div>
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {book.category} · {book.format}
              </span>
              <h1 className="mt-2 text-4xl leading-tight sm:text-5xl">{book.title}</h1>
              <p className="mt-2 text-lg text-muted-foreground">by {book.author}</p>
              <Stars rating={book.rating} count={book.rating_count} className="mt-3" />
              <p className="mt-6 text-2xl font-semibold text-primary">
                {formatPrice(book.price)}
                {book.old_price && (
                  <span className="ml-3 text-base font-normal text-muted-foreground line-through">
                    {formatPrice(book.old_price)}
                  </span>
                )}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={handleBuyNow}>Buy now</Button>
                <Button variant="outline" onClick={handleAddToCart}>
                  {added ? "Added to cart" : "Add to cart"}
                </Button>
              </div>

              {buyHref && (
                <a href={buyHref} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm text-primary hover:underline">
                  Or buy via external provider
                </a>
              )}

              {book.pages && <p className="mt-6 text-sm text-muted-foreground">{book.pages} pages</p>}
              <p className="mt-6 whitespace-pre-line leading-relaxed">{book.description}</p>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
