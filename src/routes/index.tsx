import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { booksQuery, settingsQuery, formatPrice } from "@/lib/books";
import { BookCover } from "@/components/BookCover";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
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

function Index() {
  const { data: books = [], isLoading } = useQuery(booksQuery);
  const { data: settings } = useQuery(settingsQuery);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(books.map((b) => b.category)))],
    [books],
  );
  const featured = books.filter((b) => b.featured).slice(0, 3);
  const filtered = books.filter(
    (b) =>
      (cat === "All" || b.category === cat) &&
      (b.title + b.author).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <img
          src={settings?.hero_image_url || heroImg}
          alt=""
          width={1600}
          height={1008}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-ink-fade" />
        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-28 sm:pb-24 sm:pt-40">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">The mavlonebook store</p>
          <h1 className="max-w-2xl text-4xl font-medium leading-[1.05] sm:text-6xl">
            {settings?.hero_title ?? "Books that stay with you."}
          </h1>
          <p className="mt-5 max-w-lg text-base opacity-80 sm:text-lg">
            {settings?.hero_subtitle ?? "Handpicked ebooks and paperbacks, delivered instantly."}
          </p>
          <a
            href="#store"
            className="mt-8 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
          >
            Browse the store
          </a>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pt-16">
          <h2 className="text-3xl">Featured this week</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {featured.map((b) => (
              <Link
                key={b.id}
                to="/book/$id"
                params={{ id: b.id }}
                className="group flex gap-4 rounded-xl border bg-card p-4 transition hover:-translate-y-1"
              >
                <div className="w-24 shrink-0"><BookCover book={b} /></div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">{b.category}</span>
                  <span className="mt-1 font-display text-lg leading-snug">{b.title}</span>
                  <span className="text-sm text-muted-foreground">{b.author}</span>
                  <span className="mt-auto font-semibold text-primary">{formatPrice(b.price)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section id="store" className="mx-auto max-w-6xl scroll-mt-20 px-5 pt-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-3xl">All books</h2>
          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title or author" className="pl-9" />
          </div>
        </div>
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition ${
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
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((b) => (
              <Link key={b.id} to="/book/$id" params={{ id: b.id }} className="group">
                <div className="transition group-hover:-translate-y-1"><BookCover book={b} /></div>
                <p className="mt-3 font-display text-base leading-snug">{b.title}</p>
                <p className="text-sm text-muted-foreground">{b.author}</p>
                <p className="mt-1 text-sm">
                  <span className="font-semibold text-primary">{formatPrice(b.price)}</span>
                  {b.old_price && (
                    <span className="ml-2 text-muted-foreground line-through">{formatPrice(b.old_price)}</span>
                  )}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
