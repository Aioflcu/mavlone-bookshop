import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, Search, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";

export function SiteHeader() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    navigate({ to: "/", search: term ? { q: term } : {}, hash: "store" });
    setTimeout(
      () => document.getElementById("store")?.scrollIntoView({ behavior: "smooth", block: "start" }),
      120,
    );
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-5">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border bg-card shadow-card">
            <BookOpen className="h-5 w-5 text-primary" />
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="font-display text-lg font-extrabold">mavlonebook</span>
            <span className="text-[10px] font-medium text-muted-foreground">Premium Books &amp; Guides</span>
          </span>
        </Link>
        <form onSubmit={onSubmit} className="relative ml-6 hidden w-full max-w-lg md:block">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search books, guides, topics..."
            className="rounded-full border bg-card pl-10 pr-24"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-primary px-5 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Search
          </button>
        </form>
        <nav className="ml-auto flex items-center gap-2">
          <a
            href="/#store"
            className="rounded-xl px-4 py-2 text-sm font-semibold transition hover:bg-secondary"
          >
            Store
          </a>
          <Link
            to="/admin"
            className="hidden items-center gap-2 rounded-xl border bg-card px-4 py-2 text-sm font-semibold shadow-card transition hover:bg-secondary sm:flex"
          >
            <UserRound className="h-4 w-4" /> Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-10 text-sm sm:flex-row sm:justify-between">
        <span className="font-display text-lg font-bold">mavlonebook</span>
        <span className="opacity-60">© {new Date().getFullYear()} mavlonebook. All rights reserved.</span>
      </div>
    </footer>
  );
}
