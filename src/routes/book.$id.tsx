import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { bookQuery, settingsQuery, formatPrice } from "@/lib/books";
import { BookCover } from "@/components/BookCover";
import { Stars } from "@/components/Stars";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";

export const Route = createFileRoute("/book/$id")({
  head: () => ({
    meta: [
      { title: "Book details — mavlonebook" },
      { name: "description", content: "Read about this book and buy it from mavlonebook." },
      { property: "og:title", content: "Book details — mavlonebook" },
      { property: "og:description", content: "Read about this book and buy it from mavlonebook." },
      { property: "og:type", content: "book" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookPage,
});

function BookPage() {
  const { id } = Route.useParams();
  const { data: book, isLoading } = useQuery(bookQuery(id));
  const { data: settings } = useQuery(settingsQuery);

  const buyHref =
    book?.purchase_url ||
    (settings?.whatsapp
      ? `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi, I want to buy "${book?.title}"`)}`
      : settings?.contact_email
        ? `mailto:${settings.contact_email}?subject=${encodeURIComponent(`Order: ${book?.title}`)}`
        : undefined);

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
              {buyHref ? (
                <a
                  href={buyHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Buy now
                </a>
              ) : (
                <p className="mt-6 text-sm text-muted-foreground">Purchasing opens soon.</p>
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
