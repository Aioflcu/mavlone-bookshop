import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — mavlonebook" },
      { name: "description", content: "Contact Mavlonebook for book orders, shipping support, and business inquiries." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border bg-card p-8 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Contact</p>
          <h1 className="mt-4 font-display text-4xl">We’d love to help.</h1>
          <div className="mt-8 space-y-5 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-4 w-4 text-primary" />
              <span>hello@mavlonebook.com</span>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-1 h-4 w-4 text-primary" />
              <span>+234 800 123 4567</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-4 w-4 text-primary" />
              <span>Lagos, Nigeria • Worldwide shipping available</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-8 shadow-card">
          <h2 className="text-2xl font-semibold">Send us a message</h2>
          <div className="mt-6 space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">Name</p>
              <input className="w-full rounded-xl border bg-background px-3 py-2" placeholder="Your name" />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Email</p>
              <input className="w-full rounded-xl border bg-background px-3 py-2" placeholder="Your email" />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Message</p>
              <textarea className="min-h-32 w-full rounded-xl border bg-background px-3 py-2" placeholder="Tell us how we can help" />
            </div>
            <Link to="/" className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
              Send message
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
