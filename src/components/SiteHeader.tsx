import { Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="font-display text-xl font-semibold">mavlonebook</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <a href="/#store" className="text-muted-foreground hover:text-foreground">Store</a>
          <Link to="/admin" className="text-muted-foreground hover:text-foreground">Admin</Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-10 text-sm sm:flex-row sm:justify-between">
        <span className="font-display text-lg">mavlonebook</span>
        <span className="opacity-60">© {new Date().getFullYear()} mavlonebook. All rights reserved.</span>
      </div>
    </footer>
  );
}
