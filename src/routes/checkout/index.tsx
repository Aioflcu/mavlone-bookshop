import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  buildGatewayRedirect,
  clearCart,
  formatCurrency,
  getCartTotals,
  getGatewayOptions,
  readCart,
  type CartItem,
  type CheckoutGateway,
} from "@/lib/checkout";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — mavlonebook" },
      { name: "description", content: "Secure checkout for ebooks, print books, and guides." },
    ],
  }),
  component: CheckoutPage,
});

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "Nigeria",
  notes: "",
};

function CheckoutPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [form, setForm] = useState(initialForm);
  const [paymentMethod, setPaymentMethod] = useState<CheckoutGateway>("stripe");
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const storedCart = readCart();
    setItems(storedCart);
  }, []);

  const totals = useMemo(() => getCartTotals(items), [items]);
  const gatewayOptions = getGatewayOptions();

  useEffect(() => {
    const enabledOption = gatewayOptions.find((option) => option.enabled);
    if (enabledOption) {
      setPaymentMethod(enabledOption.id as CheckoutGateway);
    }
  }, [gatewayOptions]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!items.length) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!form.fullName || !form.email || !form.address || !form.city || !form.country) {
      toast.error("Please fill in all required shipping details.");
      return;
    }

    setBusy(true);

    try {
      const gatewayUrl = buildGatewayRedirect(paymentMethod, {
        amount: totals.total,
        email: form.email,
        name: form.fullName,
        items,
      });

      if (gatewayUrl) {
        window.location.assign(gatewayUrl);
        return;
      }

      setConfirmed(true);
      clearCart();
      navigate({ to: "/checkout/success", search: { status: "pending" } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to complete checkout.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8 flex items-center gap-3">
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to cart
        </Link>
      </div>

      <div className="mb-8 flex items-center gap-3 text-primary">
        <ShieldCheck className="h-5 w-5" />
        <span className="text-sm font-semibold uppercase tracking-[0.2em]">Secure checkout</span>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address">Street address</Label>
                <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="notes">Order notes</Label>
                <Input id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Delivery instructions, special requests, or gift note" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {gatewayOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                    paymentMethod === option.id ? "border-primary bg-primary/5" : "bg-card hover:bg-secondary"
                  }`}
                >
                  <div>
                    <p className="font-semibold">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === option.id}
                    onChange={() => setPaymentMethod(option.id as CheckoutGateway)}
                    disabled={!option.enabled && option.id !== "bank_transfer"}
                    className="h-4 w-4 accent-primary"
                  />
                </label>
              ))}
              <div className="rounded-xl border border-dashed bg-secondary/50 p-4 text-sm text-muted-foreground">
                For live transactions, connect your Stripe, Flutterwave, or Paystack payment link in the environment variables and update your public URLs.
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 border-b pb-3 last:border-none last:pb-0">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border bg-card">
                  {item.cover_url ? (
                    <img src={item.cover_url} alt={item.title} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{item.format}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatCurrency(totals.shipping)}</span>
              </div>
              <div className="flex justify-between border-t pt-3 text-base font-bold">
                <span>Total</span>
                <span>{formatCurrency(totals.total)}</span>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={busy || items.length === 0}>
              <CreditCard className="mr-2 h-4 w-4" />
              {busy ? "Processing…" : "Place order"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
