import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support — mavlonebook" },
      { name: "description", content: "Support and ordering help for Mavlonebook customers." },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-4xl">Support</h1>
      <div className="mt-8 space-y-4 rounded-3xl border bg-card p-8 text-muted-foreground">
        <p>Need help with a book order, payment issue, or shipping question?</p>
        <p>Email: hello@mavlonebook.com</p>
        <p>Phone: +234 800 123 4567</p>
        <p>We usually respond within 24 hours.</p>
      </div>
      <div className="mt-8">
        <Link to="/contact" className="text-sm font-semibold text-primary hover:underline">Contact us</Link>
      </div>
    </div>
  );
}
