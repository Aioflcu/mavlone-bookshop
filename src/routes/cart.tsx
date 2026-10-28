import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type CartItem, formatCurrency, getCartTotals, readCart, removeFromCart, updateCartQuantity } from "@/lib/checkout";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart — mavlonebook" },
      { name: "description", content: "Review your cart before your secure checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readCart());
  }, []);

  const totals = useMemo(() => getCartTotals(items), [items]);

  const updateQuantity = (id: string, delta: number) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    const nextQuantity = item.quantity + delta;
    setItems(nextQuantity > 0 ? updateCartQuantity(id, nextQuantity) : removeFromCart(id));
  };

  const onRemove = (id: string) => {
    setItems(removeFromCart(id));
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-5 py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        <h1 className="mt-6 font-display text-4xl">Your cart is empty</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Explore the bookstore and add ebooks, paperbacks, and guides to your order.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/">Continue shopping</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/signin">Sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Cart</p>
          <h1 className="mt-2 font-display text-4xl">Your order</h1>
        </div>
        <Button variant="outline" asChild>
          <Link to="/">Continue shopping</Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-card">
                  {item.cover_url ? (
                    <img src={item.cover_url} alt={item.title} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {item.format}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.author || "Mavlonebook"}</p>
                  <p className="mt-2 text-sm font-medium text-primary">{formatCurrency(item.price)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, -1)}
                    className="rounded-full border p-2 transition hover:bg-secondary"
                    aria-label={`Decrease quantity for ${item.title}`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="rounded-full border p-2 transition hover:bg-secondary"
                    aria-label={`Increase quantity for ${item.title}`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3 sm:justify-end">
                  <p className="text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="rounded-full border p-2 text-destructive transition hover:bg-destructive/10"
                    aria-label={`Remove ${item.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{formatCurrency(totals.shipping)}</span>
            </div>
            <div className="flex justify-between border-t pt-3 text-base font-bold">
              <span>Total</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
            <Button
              className="w-full"
              onClick={() => navigate({ to: "/checkout" })}
            >
              Secure checkout
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/signin">Already a customer? Sign in</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
