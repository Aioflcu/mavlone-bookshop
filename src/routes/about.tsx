import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpenText } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — mavlonebook" },
      { name: "description", content: "Learn about Mavlonebook and our mission to bring great books to readers worldwide." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <div className="rounded-3xl border bg-card p-8 shadow-card sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">About us</p>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl">Books that move people forward.</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Mavlonebook is a modern bookstore for readers, professionals, and curious minds. We sell ebooks, paperbacks, and practical guides to help people learn, grow, and feel inspired.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6">
          <BookOpenText className="h-8 w-8 text-primary" />
          <h2 className="mt-4 text-xl font-semibold">Curated titles</h2>
          <p className="mt-2 text-sm text-muted-foreground">We feature books that are useful, life-changing, and relevant to the modern reader.</p>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-semibold">Worldwide delivery</h2>
          <p className="mt-2 text-sm text-muted-foreground">We support a global audience with international checkout and delivery options.</p>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-semibold">Secure ordering</h2>
          <p className="mt-2 text-sm text-muted-foreground">Customers can buy from a secure checkout flow using trusted gateways and direct business support.</p>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <Button asChild>
          <Link to="/">Browse books</Link>
        </Button>
      </div>
    </div>
  );
}
