import type { Book } from "@/lib/books";

export function BookCover({ book, className = "" }: { book: Book; className?: string }) {
  if (book.cover_url) {
    return (
      <img
        src={book.cover_url}
        alt={book.title}
        loading="lazy"
        className={`aspect-[2/3] w-full rounded-md object-cover shadow-book ${className}`}
      />
    );
  }
  return (
    <div
      className={`flex aspect-[2/3] w-full flex-col justify-between rounded-md bg-primary p-4 text-primary-foreground shadow-book ${className}`}
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-gold">{book.category}</span>
      <div>
        <p className="font-display text-lg leading-tight">{book.title}</p>
        <p className="mt-2 text-xs opacity-75">{book.author}</p>
      </div>
    </div>
  );
}
