CREATE TABLE public.wishlists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  image TEXT,
  archived BOOLEAN NOT NULL DEFAULT FALSE,
  shared JSONB NOT NULL DEFAULT '[]'::jsonb,
  position INT NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wishlists TO anon, authenticated;
GRANT ALL ON public.wishlists TO service_role;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Alla kan läsa listor" ON public.wishlists FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Alla kan skapa listor" ON public.wishlists FOR INSERT TO anon, authenticated WITH CHECK (TRUE);
CREATE POLICY "Alla kan ändra listor" ON public.wishlists FOR UPDATE TO anon, authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Alla kan ta bort listor" ON public.wishlists FOR DELETE TO anon, authenticated USING (TRUE);

CREATE TABLE public.items (
  id TEXT PRIMARY KEY,
  list_id TEXT NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  image TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  price_known BOOLEAN NOT NULL DEFAULT TRUE,
  original_price NUMERIC,
  compared BOOLEAN NOT NULL DEFAULT FALSE,
  bought BOOLEAN NOT NULL DEFAULT FALSE,
  bought_month TEXT,
  position INT NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.items TO anon, authenticated;
GRANT ALL ON public.items TO service_role;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Alla kan läsa produkter" ON public.items FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Alla kan lägga till produkter" ON public.items FOR INSERT TO anon, authenticated WITH CHECK (TRUE);
CREATE POLICY "Alla kan ändra produkter" ON public.items FOR UPDATE TO anon, authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Alla kan ta bort produkter" ON public.items FOR DELETE TO anon, authenticated USING (TRUE);

CREATE TABLE public.offers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  item_id TEXT NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  store TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  url TEXT NOT NULL DEFAULT ''
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.offers TO anon, authenticated;
GRANT ALL ON public.offers TO service_role;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Alla kan läsa erbjudanden" ON public.offers FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Alla kan lägga till erbjudanden" ON public.offers FOR INSERT TO anon, authenticated WITH CHECK (TRUE);
CREATE POLICY "Alla kan ändra erbjudanden" ON public.offers FOR UPDATE TO anon, authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Alla kan ta bort erbjudanden" ON public.offers FOR DELETE TO anon, authenticated USING (TRUE);

CREATE TABLE public.budgets (
  month TEXT PRIMARY KEY,
  amount NUMERIC NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.budgets TO anon, authenticated;
GRANT ALL ON public.budgets TO service_role;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Alla kan läsa budgetar" ON public.budgets FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Alla kan sätta budgetar" ON public.budgets FOR INSERT TO anon, authenticated WITH CHECK (TRUE);
CREATE POLICY "Alla kan ändra budgetar" ON public.budgets FOR UPDATE TO anon, authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Alla kan ta bort budgetar" ON public.budgets FOR DELETE TO anon, authenticated USING (TRUE);