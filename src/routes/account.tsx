import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My account — mavlonebook" },
      { name: "description", content: "Manage your Mavlonebook account and orders." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <h1 className="font-display text-4xl">My account</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border bg-card p-6">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="mt-3 text-sm text-muted-foreground">Update your shipping address, contact details, and reading preferences.</p>
          <Link to="/signin" className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Sign in to manage account</Link>
        </div>
        <div className="rounded-3xl border bg-card p-6">
          <h2 className="text-xl font-semibold">Orders</h2>
          <p className="mt-3 text-sm text-muted-foreground">View past orders, status, delivery details, and support requests.</p>
          <Link to="/checkout" className="mt-5 inline-flex rounded-xl border px-5 py-3 text-sm font-semibold">Go to checkout</Link>
        </div>
      </div>
    </div>
  );
}
