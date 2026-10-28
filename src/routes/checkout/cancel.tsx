import { createFileRoute, Link } from "@tanstack/react-router";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/checkout/cancel")({
  head: () => ({
    meta: [
      { title: "Payment cancelled — mavlonebook" },
      { name: "description", content: "Your payment was cancelled and no charge was made." },
    ],
  }),
  component: CancelPage,
});

function CancelPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-5 py-16 text-center">
      <XCircle className="h-16 w-16 text-amber-500" />
      <h1 className="mt-6 font-display text-4xl">Payment cancelled</h1>
      <p className="mt-3 text-muted-foreground">
        Your order was not completed. You can try again or contact us for assistance.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link to="/checkout">Try again</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/contact">Contact support</Link>
        </Button>
      </div>
    </div>
  );
}
