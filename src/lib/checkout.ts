export type CheckoutGateway = "stripe" | "flutterwave" | "paystack" | "bank_transfer";

export type CartItem = {
  id: string;
  title: string;
  author?: string | null;
  price: number;
  cover_url?: string | null;
  format: string;
  quantity: number;
  type?: "ebook" | "paperback" | "audiobook" | "print";
};

const CART_KEY = "mavlonebook.cart.v1";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(
  item: Pick<CartItem, "id" | "title" | "author" | "price" | "cover_url" | "format" | "type">,
  quantity = 1,
) {
  const cart = readCart();
  const normalizedQty = Math.max(1, Number(quantity) || 1);
  const existingIndex = cart.findIndex((entry) => entry.id === item.id);

  if (existingIndex >= 0) {
    cart[existingIndex] = {
      ...cart[existingIndex],
      quantity: cart[existingIndex].quantity + normalizedQty,
    };
    persistCart(cart);
    return cart;
  }

  const nextCart = [
    ...cart,
    {
      ...item,
      quantity: normalizedQty,
    },
  ];
  persistCart(nextCart);
  return nextCart;
}

export function updateCartQuantity(id: string, quantity: number) {
  const nextCart = readCart()
    .map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, Number(quantity) || 1) }
        : item,
    )
    .filter((item) => item.quantity > 0);

  persistCart(nextCart);
  return nextCart;
}

export function removeFromCart(id: string) {
  const nextCart = readCart().filter((item) => item.id !== id);
  persistCart(nextCart);
  return nextCart;
}

export function clearCart() {
  persistCart([]);
  return [];
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
}

export function getCartTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = items.some((item) => item.format === "paperback" || item.type === "print")
    ? 12
    : 0;
  const total = subtotal + shipping;

  return { subtotal, shipping, total };
}

export function getGatewayOptions() {
  const stripeCheckoutUrl = import.meta.env.VITE_STRIPE_CHECKOUT_URL as string | undefined;
  const flutterwaveCheckoutUrl = import.meta.env.VITE_FLUTTERWAVE_CHECKOUT_URL as string | undefined;
  const paystackCheckoutUrl = import.meta.env.VITE_PAYSTACK_CHECKOUT_URL as string | undefined;

  return [
    {
      id: "stripe" as const,
      label: "Stripe",
      description: "Global cards and digital payments",
      enabled: Boolean(stripeCheckoutUrl),
      url: stripeCheckoutUrl,
    },
    {
      id: "flutterwave" as const,
      label: "Flutterwave",
      description: "African cards and local payment methods",
      enabled: Boolean(flutterwaveCheckoutUrl),
      url: flutterwaveCheckoutUrl,
    },
    {
      id: "paystack" as const,
      label: "Paystack",
      description: "Nigerian card and bank payments",
      enabled: Boolean(paystackCheckoutUrl),
      url: paystackCheckoutUrl,
    },
    {
      id: "bank_transfer" as const,
      label: "Bank transfer",
      description: "For invoice and print-book orders",
      enabled: true,
      url: undefined,
    },
  ];
}

export function buildGatewayRedirect(
  gateway: CheckoutGateway,
  order: { amount: number; email: string; name: string; items: CartItem[] },
) {
  if (gateway === "bank_transfer") return undefined;

  const gatewayOptions = getGatewayOptions();
  const provider = gatewayOptions.find((option) => option.id === gateway);
  if (!provider?.url) return undefined;

  const url = new URL(provider.url);
  url.searchParams.set("amount", String(Math.round(order.amount * 100)));
  url.searchParams.set("currency", "USD");
  url.searchParams.set("customer_email", order.email || "customer@example.com");
  url.searchParams.set("customer_name", order.name || "Mavlonebook customer");
  url.searchParams.set("metadata", JSON.stringify({
    orderItems: order.items.map((item) => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
    })),
  }));

  return url.toString();
}
