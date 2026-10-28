import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy policy — mavlonebook" },
      { name: "description", content: "How Mavlonebook handles information, orders, and personal data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-4xl">Privacy policy</h1>
      <div className="mt-8 space-y-5 text-muted-foreground">
        <p>We respect your privacy and only use customer information to process orders, provide support, and improve the service.</p>
        <p>We do not sell personal data. Payment and shipping details are used only for fulfillment and secure payment handling through our chosen payment providers.</p>
        <p>We keep customer records only as long as necessary for order management, legal compliance, and customer support.</p>
        <p>If you have questions about your personal data, contact hello@mavlonebook.com.</p>
      </div>
      <div className="mt-8">
        <Link to="/" className="text-sm font-semibold text-primary hover:underline">Back to store</Link>
      </div>
    </div>
  );
}
