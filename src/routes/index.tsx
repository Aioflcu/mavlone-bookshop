import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { addToCart } from "@/lib/checkout";
import { BookCover } from "@/components/BookCover";
import { Stars } from "@/components/Stars";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { bookQuery, booksQuery, formatPrice, settingsQuery, buyHrefFor, type Book } from "@/lib/books";

export const Route = createFileRoute("/")({
  validateSearch: z.object({ q: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "mavlonebook — Ebooks & Paperbacks" },
      { name: "description", content: "Discover handpicked ebooks and paperbacks at mavlonebook." },
      { property: "og:title", content: "mavlonebook — Ebooks & Paperbacks" },
      { property: "og:description", content: "Discover handpicked ebooks and paperbacks at mavlonebook." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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

function Index() {
  const { data: books = [], isLoading } = useQuery(booksQuery);
  const { data: settings } = useQuery(settingsQuery);
  const { q: qParam } = Route.useSearch();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [fmt, setFmt] = useState<string>("all");

  useEffect(() => {
    setQ(qParam ?? "");
  }, [qParam]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(books.map((b) => b.category)))], [books]);
  const formats = useMemo(() => Array.from(new Set(books.map((b) => b.format))).filter((f) => !!f), [books]);
  const newReleases = useMemo(() => books.slice(0, 10), [books]);
  const favorites = useMemo(
    () =>
      [...books]
        .filter((b) => (b.rating ?? 0) > 0)
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.rating_count ?? 0) - (a.rating_count ?? 0))
        .slice(0, 10),
    [books],
  );

  const filtered = books.filter(
    (b) =>
      (cat === "All" || b.category === cat) &&
      (fmt === "all" || b.format === fmt) &&
      (b.title + b.author).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-5 sm:pt-8">
          <div className="rounded-3xl border bg-card p-8 shadow-card sm:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">mavlonebook</p>
                <h1 className="mt-4 font-display text-4xl sm:text-5xl">
                  {settings?.hero_title ?? "Books that stay with you."}
                </h1>
                <p className="mt-5 text-base text-muted-foreground sm:text-lg">
                  {settings?.hero_subtitle ?? "Handpicked ebooks and paperbacks, delivered instantly."}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/shop" className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">Explore Books</Link>
                  <Link to="/pricing" className="rounded-xl border px-6 py-3 text-sm font-semibold transition hover:bg-secondary">See pricing</Link>
                </div>
              </div>
              <div className="rounded-3xl border bg-secondary p-6 shadow-card">
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="rounded-2xl bg-card p-4">
                    <p className="text-[11px] uppercase tracking-[0.2em]">Formats</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">{formats.length}</p>
                  </div>
                  <div className="rounded-2xl bg-card p-4">
                    <p className="text-[11px] uppercase tracking-[0.2em]">Titles</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">{books.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-5">
          <div className="rounded-3xl border bg-card p-6 shadow-card sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl">Featured</h2>
                <p className="mt-1 text-sm text-muted-foreground">Instant-download ebooks and paperbacks for readers worldwide.</p>
              </div>
              <div className="relative sm:w-72">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search title or author"
                  className="w-full rounded-full border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    cat === c ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-secondary"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {isLoading ? (
              <p className="mt-10 text-muted-foreground">Loading books…</p>
            ) : filtered.length === 0 ? (
              <p className="mt-10 text-muted-foreground">No books found.</p>
            ) : (
              <div id="store" className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                {filtered.map((b) => (
                  <BookCard key={b.id} book={b} buyHref={buyHrefFor(b, settings)} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
