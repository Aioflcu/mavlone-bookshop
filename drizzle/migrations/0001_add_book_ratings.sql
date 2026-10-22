ALTER TABLE public.books
  ADD COLUMN rating numeric(2,1),
  ADD COLUMN rating_count integer;

COMMENT ON COLUMN public.books.rating IS 'Average reader rating out of 5, edited by the store owner';
COMMENT ON COLUMN public.books.rating_count IS 'Number of reader reviews backing the rating, edited by the store owner';