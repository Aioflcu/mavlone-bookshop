import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ShieldCheck, ShoppingBag, Truck } from "lucide-react";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Bookshop — mavlonebook" },
      { name: "description", content: "Browse the Mavlonebook store for books, digital reads, and print orders." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <div className="rounded-3xl border bg-card p-8 shadow-card sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Browse collection</p>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl">Your future shelf starts here.</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">Shop ebooks, business guides, and print books from a single storefront built for secure global delivery.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/" className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Explore store</Link>
          <Link to="/cart" className="rounded-xl border px-5 py-3 text-sm font-semibold">View cart</Link>
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <h2 className="mt-4 text-xl font-semibold">Physical books</h2>
          <p className="mt-2 text-sm text-muted-foreground">Print books for personal reading, gifting, or office shelves.</p>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <Truck className="h-8 w-8 text-primary" />
          <h2 className="mt-4 text-xl font-semibold">Worldwide shipping</h2>
          <p className="mt-2 text-sm text-muted-foreground">Ship to your local area or to customers in other countries.</p>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h2 className="mt-4 text-xl font-semibold">Secure checkout</h2>
          <p className="mt-2 text-sm text-muted-foreground">Buy with a trusted provider, invoice, or quick direct arrangement.</p>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-center text-sm font-semibold text-primary">
        <Link to="/" className="inline-flex items-center gap-2">Start shopping <ArrowUpRight className="h-4 w-4" /></Link>
      </div>
    </div>
  );
}
