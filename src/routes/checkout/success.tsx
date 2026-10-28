import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/checkout/success")({
  validateSearch: (search) => ({
    status: search.status ?? "success",
  }),
  head: () => ({
    meta: [
      { title: "Order placed — mavlonebook" },
      { name: "description", content: "Your order has been placed successfully." },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { status } = Route.useSearch();

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-5 py-16 text-center">
      <CheckCircle2 className="h-16 w-16 text-emerald-500" />
      <h1 className="mt-6 font-display text-4xl">Order received</h1>
      <p className="mt-3 text-muted-foreground">
        {status === "pending"
          ? "Your order is confirmed and the payment will be completed through your selected provider."
          : "Thank you for shopping with mavlonebook. Your order has been placed successfully."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link to="/">Return to store</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/contact">Need help?</Link>
        </Button>
      </div>
    </div>
  );
}
