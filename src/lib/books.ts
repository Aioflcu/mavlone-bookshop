import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Book = Tables<"books">;
export type Settings = Tables<"site_settings">;

export const booksQuery = queryOptions({
  queryKey: ["books"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const bookQuery = (id: string) =>
  queryOptions({
    queryKey: ["book", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("books").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const settingsQuery = queryOptions({
  queryKey: ["settings"],
  queryFn: async () => {
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw error;
    return data;
  },
});

export function formatPrice(n: number | null | undefined) {
  if (n == null) return "";
  return "$" + Number(n).toFixed(2);
}

export async function uploadImage(file: File) {
  const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
  const { error } = await supabase.storage.from("covers").upload(path, file, { upsert: false });
  if (error) throw error;
  const { data, error: e2 } = await supabase.storage
    .from("covers")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (e2) throw e2;
  return data.signedUrl;
}
