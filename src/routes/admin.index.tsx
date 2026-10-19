import { createFileRoute, redirect, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, LogOut, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { booksQuery, settingsQuery, formatPrice, uploadImage, type Book, type Settings } from "@/lib/books";
import { BookCover } from "@/components/BookCover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/admin/login" });
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
    return { isAdmin: !!isAdmin, email: data.user.email };
  },
  head: () => ({
    meta: [
      { title: "Admin dashboard — mavlonebook" },
      { name: "description", content: "Manage books, pictures and store settings." },
      { property: "og:title", content: "Admin dashboard — mavlonebook" },
      { property: "og:description", content: "Manage books, pictures and store settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Draft = Partial<Book>;
const empty: Draft = { title: "", author: "", description: "", category: "General", format: "ebook", price: 0, featured: false, published: true };

function AdminPage() {
  const { isAdmin, email } = Route.useRouteContext();
  const navigate = useNavigate();

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
        <h1 className="text-2xl">No admin access</h1>
        <p className="text-muted-foreground">{email} isn't an admin account.</p>
        <Button variant="outline" onClick={logout}>Sign out</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b bg-ink text-ink-foreground">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <span className="font-display text-xl">mavlonebook <span className="text-sm text-gold">admin</span></span>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/" className="inline-flex items-center gap-1 opacity-80 hover:opacity-100">
              View store <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <button onClick={logout} className="inline-flex items-center gap-1 opacity-80 hover:opacity-100">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">
        <Tabs defaultValue="books">
          <TabsList>
            <TabsTrigger value="books">Books</TabsTrigger>
            <TabsTrigger value="settings">Store settings</TabsTrigger>
          </TabsList>
          <TabsContent value="books"><BooksPanel /></TabsContent>
          <TabsContent value="settings"><SettingsPanel /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function ImagePicker({ value, onChange, label }: { value?: string | null | undefined; onChange: (u: string) => void; label: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 flex items-center gap-3">
        {value && <img src={value} alt="" className="h-20 w-14 rounded object-cover" />}
        <Input
          type="file"
          accept="image/*"
          disabled={busy}
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setBusy(true);
            try {
              onChange(await uploadImage(f));
              toast.success("Picture uploaded");
            } catch (err) {
              toast.error((err as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        />
      </div>
      {busy && <p className="mt-1 text-xs text-muted-foreground">Uploading…</p>}
    </div>
  );
}

function BooksPanel() {
  const qc = useQueryClient();
  const { data: books = [] } = useQuery(booksQuery);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof Book, v: unknown) => setDraft((d) => ({ ...d, [k]: v }));

  async function save() {
    if (!draft?.title) { toast.error("Title is required"); return; }
    setSaving(true);
    const payload = {
      title: draft.title,
      author: draft.author ?? "",
      description: draft.description ?? "",
      category: draft.category || "General",
      format: draft.format || "ebook",
      price: Number(draft.price) || 0,
      old_price: draft.old_price ? Number(draft.old_price) : null,
      cover_url: draft.cover_url ?? null,
      purchase_url: draft.purchase_url || null,
      pages: draft.pages ? Number(draft.pages) : null,
      featured: !!draft.featured,
      published: draft.published ?? true,
    };
    const { error } = draft.id
      ? await supabase.from("books").update(payload).eq("id", draft.id)
      : await supabase.from("books").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
    setDraft(null);
    qc.invalidateQueries();
  }

  async function remove(b: Book) {
    if (!confirm(`Delete "${b.title}"?`)) return;
    const { error } = await supabase.from("books").delete().eq("id", b.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    qc.invalidateQueries();
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Books ({books.length})</h2>
        <Button onClick={() => setDraft({ ...empty })}><Plus className="h-4 w-4" /> Add book</Button>
      </div>
      <div className="mt-6 divide-y rounded-xl border bg-card">
        {books.map((b) => (
          <div key={b.id} className="flex items-center gap-4 p-3">
            <div className="w-12 shrink-0"><BookCover book={b} /></div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{b.title}</p>
              <p className="truncate text-sm text-muted-foreground">
                {b.author} · {formatPrice(b.price)} {b.featured && "· Featured"} {!b.published && "· Hidden"}
              </p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => setDraft(b)}><Pencil className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={() => remove(b)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
        {books.length === 0 && <p className="p-6 text-muted-foreground">No books yet.</p>}
      </div>

      <Dialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{draft?.id ? "Edit book" : "Add book"}</DialogTitle></DialogHeader>
          {draft && (
            <div className="space-y-4">
              <ImagePicker label="Cover picture" value={draft.cover_url} onChange={(u) => set("cover_url", u)} />
              <div><Label>Title</Label><Input value={draft.title ?? ""} onChange={(e) => set("title", e.target.value)} /></div>
              <div><Label>Author</Label><Input value={draft.author ?? ""} onChange={(e) => set("author", e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Category</Label><Input value={draft.category ?? ""} onChange={(e) => set("category", e.target.value)} /></div>
                <div>
                  <Label>Format</Label>
                  <select
                    className="mt-0 flex h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                    value={draft.format ?? "ebook"}
                    onChange={(e) => set("format", e.target.value)}
                  >
                    <option value="ebook">Ebook</option>
                    <option value="paperback">Paperback</option>
                    <option value="audiobook">Audiobook</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Price</Label><Input type="number" step="0.01" value={draft.price ?? ""} onChange={(e) => set("price", e.target.value)} /></div>
                <div><Label>Old price</Label><Input type="number" step="0.01" value={draft.old_price ?? ""} onChange={(e) => set("old_price", e.target.value)} /></div>
                <div><Label>Pages</Label><Input type="number" value={draft.pages ?? ""} onChange={(e) => set("pages", e.target.value)} /></div>
              </div>
              <div><Label>Description</Label><Textarea rows={5} value={draft.description ?? ""} onChange={(e) => set("description", e.target.value)} /></div>
              <div><Label>Buy link (optional)</Label><Input placeholder="https://…" value={draft.purchase_url ?? ""} onChange={(e) => set("purchase_url", e.target.value)} /></div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm"><Switch checked={!!draft.featured} onCheckedChange={(v) => set("featured", v)} /> Featured</label>
                <label className="flex items-center gap-2 text-sm"><Switch checked={draft.published ?? true} onCheckedChange={(v) => set("published", v)} /> Visible in store</label>
              </div>
              <Button className="w-full" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save book"}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SettingsPanel() {
  const qc = useQueryClient();
  const { data } = useQuery(settingsQuery);
  const [s, setS] = useState<Settings | null | undefined>(data);
  useEffect(() => setS(data), [data]);
  if (!s) return null;

  async function save() {
    const { error } = await supabase.from("site_settings").update({
      hero_title: s!.hero_title,
      hero_subtitle: s!.hero_subtitle,
      hero_image_url: s!.hero_image_url,
      contact_email: s!.contact_email,
      whatsapp: s!.whatsapp,
    }).eq("id", 1);
    if (error) { toast.error(error.message); return; }
    toast.success("Settings saved");
    qc.invalidateQueries();
  }

  return (
    <div className="mt-6 max-w-xl space-y-4">
      <h2 className="text-2xl">Store settings</h2>
      <ImagePicker label="Front page picture" value={s.hero_image_url} onChange={(u) => setS({ ...s, hero_image_url: u })} />
      <div><Label>Headline</Label><Input value={s.hero_title} onChange={(e) => setS({ ...s, hero_title: e.target.value })} /></div>
      <div><Label>Sub-headline</Label><Textarea value={s.hero_subtitle} onChange={(e) => setS({ ...s, hero_subtitle: e.target.value })} /></div>
      <div><Label>WhatsApp number (for orders)</Label><Input placeholder="+234…" value={s.whatsapp ?? ""} onChange={(e) => setS({ ...s, whatsapp: e.target.value })} /></div>
      <div><Label>Contact email</Label><Input type="email" value={s.contact_email ?? ""} onChange={(e) => setS({ ...s, contact_email: e.target.value })} /></div>
      <Button onClick={save}>Save settings</Button>
    </div>
  );
}
