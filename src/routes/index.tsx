import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search, ShoppingBag } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import {
  booksQuery,
  settingsQuery,
  formatPrice,
  buyHrefFor,
  type Book,
  type Settings,
} from "@/lib/books";
import { BookCover } from "@/components/BookCover";
import { Stars } from "@/components/Stars";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Input } from "@/components/ui/input";

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

const FORMAT_LABELS: Record<string, string> = {
  ebook: "Ebooks",
  paperback: "Paperbacks",
  audiobook: "Audiobooks",
};

const FORMAT_SHELVES: Record<string, { title: string; subtitle: string }> = {
  ebook: { title: "Explore Ebooks", subtitle: "Instant-download picks for every reader." },
  paperback: { title: "Explore Print Books", subtitle: "Popular print books for focused offline reading." },
  audiobook: { title: "Latest Audiobooks", subtitle: "Listen and grow anywhere." },
};

function BookCard({
  book,
  buyHref,
  className = "",
}: {
  book: Book;
  buyHref?: string | undefined;
  className?: string;
}) {
  return (
    <div
      className={`group relative flex flex-col rounded-2xl border bg-card p-3 transition duration-300 hover:-translate-y-1 hover:shadow-lift ${className}`}
    >
      <Link
        to="/book/$id"
        params={{ id: book.id }}
        className="absolute inset-0 z-10 rounded-2xl"
        aria-label={book.title}
      />
      <div className="pointer-events-none">
        <BookCover book={book} />
        <p className="mt-3 truncate text-sm font-bold">{book.title}</p>
        <Stars rating={book.rating} count={book.rating_count} className="mt-1" />
      </div>
      <div className="relative z-20 mt-auto flex items-center justify-between pt-2">
        <p className="pointer-events-none text-sm">
          <span className="font-extrabold">{formatPrice(book.price)}</span>
          {book.old_price && (
            <span className="ml-1.5 text-xs text-muted-foreground line-through">
              {formatPrice(book.old_price)}
            </span>
          )}
        </p>
        {buyHref && (
          <a
            href={buyHref}
            target="_blank"
            rel="noreferrer"
            aria-label={`Buy ${book.title}`}
            className="rounded-full border bg-card p-2.5 transition hover:bg-primary hover:text-primary-foreground"
          >
            <ShoppingBag className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}

function CarouselShelf({
  title,
  subtitle,
  books,
  settings,
}: {
  title: string;
  subtitle: string;
  books: Book[];
  settings?: Settings | null | undefined;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  if (books.length === 0) return null;
  const scroll = (dir: number) => rowRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });

  return (
    <div className="mt-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-xl sm:text-2xl">{title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button
            aria-label={`Scroll back — ${title}`}
            onClick={() => scroll(-1)}
            className="rounded-full border bg-card p-2 transition hover:bg-secondary"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            aria-label={`Scroll forward — ${title}`}
            onClick={() => scroll(1)}
            className="rounded-full border bg-card p-2 transition hover:bg-secondary"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-5 flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {books.map((b) => (
          <BookCard
            key={b.id}
            book={b}
            buyHref={buyHrefFor(b, settings)}
            className="w-44 shrink-0 snap-start sm:w-48"
          />
        ))}
      </div>
    </div>
  );
}

function CoverFan({ books, fallbackImage }: { books: Book[]; fallbackImage: string }) {
  const covers = books.filter((b) => b.cover_url).slice(0, 5);
  if (covers.length === 0) {
    return (
      <div className="relative mx-auto w-full max-w-md rotate-2">
        <img src={fallbackImage} alt="" className="w-full rounded-2xl object-cover shadow-lift" />
      </div>
    );
  }
  const n = covers.length;
  return (
    <div className="relative mx-auto hidden h-[340px] w-full max-w-xl lg:block">
      {covers.map((b, i) => {
        const offset = i - (n - 1) / 2;
        return (
          <div
            key={b.id}
            className="absolute left-1/2 top-1/2 w-44"
            style={{
              transform: `translate(-50%, -50%) translateX(${offset * 80}px) translateY(${
                Math.abs(offset) * 10
              }px) rotate(${offset * 6}deg)`,
              zIndex: 30 - Math.abs(offset) * 10,
            }}
          >
            <BookCover book={b} />
          </div>
        );
      })}
    </div>
  );
}

function Index() {
  const { data: books = [], isLoading } = useQuery(booksQuery);
  const { data: settings } = useQuery(settingsQuery);
  const { q: qParam } = Route.useSearch();
  const [q, setQ] = useState(qParam ?? "");
  const [cat, setCat] = useState("All");
  const [fmt, setFmt] = useState<string>("all");

  useEffect(() => {
    setQ(qParam ?? "");
  }, [qParam]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(books.map((b) => b.category)))],
    [books],
  );
  const formats = useMemo(
    () => Array.from(new Set(books.map((b) => b.format))).filter((f) => FORMAT_LABELS[f]),
    [books],
  );
  const newReleases = useMemo(() => books.slice(0, 10), [books]);
  const favorites = useMemo(
    () =>
      [...books]
        .filter((b) => (b.rating ?? 0) > 0)
        .sort(
          (a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.rating_count ?? 0) - (a.rating_count ?? 0),
        )
        .slice(0, 10),
    [books],
  );
  const filtered = books.filter(
    (b) =>
      (cat === "All" || b.category === cat) &&
      (fmt === "all" || b.format === fmt) &&
      (b.title + b.author).toLowerCase().includes(q.toLowerCase()),
  );
  const hasAudiobooks = books.some((b) => b.format === "audiobook");

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-5 sm:pt-8">
        <div className="relative overflow-hidden rounded-3xl border bg-card px-6 py-12 shadow-card sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blob" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-blob opacity-70" />
          <div className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <span className="inline-flex rounded-full bg-secondary px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
                The mavlonebook bookstore
              </span>
              <h1 className="mt-5 max-w-xl font-display text-4xl font-extrabold leading-[1.08] sm:text-5xl">
                {settings?.hero_title ?? "Books that stay with you."}
              </h1>
              <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
                {settings?.hero_subtitle ?? "Handpicked ebooks and paperbacks, delivered instantly."}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#store"
                  className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Explore Books
                </a>
                {hasAudiobooks && (
                  <button
                    onClick={() => {
                      setFmt("audiobook");
                      document
                        .getElementById("store")
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="rounded-xl border bg-card px-6 py-3 text-sm font-semibold transition hover:bg-secondary"
                  >
                    Audiobooks
                  </button>
                )}
              </div>
            </div>
            <CoverFan books={books} fallbackImage={settings?.hero_image_url || heroImg} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-5 sm:pt-8">
        <div className="rounded-3xl border bg-card p-6 shadow-card sm:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl">Featured</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Instant-download ebooks and reader favorites from the mavlonebook store.
              </p>
            </div>
            <a href="#store" className="text-sm font-semibold hover:underline">
              Explore Our Bookstore
            </a>
          </div>
          <CarouselShelf
            title="New Releases"
            subtitle="Fast-start digital picks readers buy first."
            books={newReleases}
            settings={settings}
          />
          {formats.map((f) => (
            <CarouselShelf
              key={f}
              title={FORMAT_SHELVES[f]?.title ?? FORMAT_LABELS[f]}
              subtitle={FORMAT_SHELVES[f]?.subtitle ?? ""}
              books={books.filter((b) => b.format === f).slice(0, 10)}
              settings={settings}
            />
          ))}
          <CarouselShelf
            title="Reader Favorites"
            subtitle="The highest-rated titles on the store."
            books={favorites}
            settings={settings}
          />
        </div>
      </section>

      <section id="store" className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-16 sm:px-5 sm:pt-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-3xl">All books</h2>
          <div className="relative sm:w-72">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title or author"
              className="rounded-full border bg-card pl-10"
            />
          </div>
        </div>

        {formats.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setFmt("all")}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                fmt === "all"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card hover:bg-secondary"
              }`}
            >
              All formats
            </button>
            {formats.map((f) => (
              <button
                key={f}
                onClick={() => setFmt(f)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  fmt === f
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-card hover:bg-secondary"
                }`}
              >
                {FORMAT_LABELS[f]}
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                cat === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card hover:bg-secondary"
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
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((b) => (
              <BookCard key={b.id} book={b} buyHref={buyHrefFor(b, settings)} />
            ))}
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
