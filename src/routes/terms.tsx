import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — mavlonebook" },
      { name: "description", content: "Terms of service for buying books from Mavlonebook." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-4xl">Terms of service</h1>
      <div className="mt-8 space-y-5 text-muted-foreground">
        <p>By placing an order, you agree to provide accurate shipping and payment information.</p>
        <p>Digital products are delivered electronically and are intended for personal use. We do not guarantee resale rights unless specified.</p>
        <p>Physical books are subject to shipping times and delivery conditions outside our control.</p>
        <p>We reserve the right to refuse or cancel orders where fraud, inaccurate details, or payment issues are suspected.</p>
      </div>
      <div className="mt-8">
        <Link to="/" className="text-sm font-semibold text-primary hover:underline">Back to store</Link>
      </div>
    </div>
  );
}
