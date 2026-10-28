import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — mavlonebook" },
      { name: "description", content: "See how Mavlonebook prices ebooks, paperbacks, and bulk orders." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <h1 className="font-display text-4xl">Simple pricing</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border bg-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Digital</p>
          <h2 className="mt-4 text-3xl font-bold">$9–$29</h2>
          <p className="mt-3 text-sm text-muted-foreground">Ebooks and digital guides delivered instantly.</p>
        </div>
        <div className="rounded-3xl border border-primary bg-primary/5 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Print</p>
          <h2 className="mt-4 text-3xl font-bold">$18–$60</h2>
          <p className="mt-3 text-sm text-muted-foreground">Paperback orders with international shipping options.</p>
        </div>
        <div className="rounded-3xl border bg-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Bulk</p>
          <h2 className="mt-4 text-3xl font-bold">Custom</h2>
          <p className="mt-3 text-sm text-muted-foreground">Special pricing for schools, businesses, and book clubs.</p>
        </div>
      </div>
      <div className="mt-12 flex justify-center">
        <Button asChild>
          <Link to="/">Explore books</Link>
        </Button>
      </div>
    </div>
  );
}
