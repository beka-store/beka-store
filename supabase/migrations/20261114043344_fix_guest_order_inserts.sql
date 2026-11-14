/*
# Allow guest orders to save, even without a receipt upload

1. Modified table: orders
- `receipt_path` is now optional, so an order is saved even if the screenshot upload fails.
- New trigger `set_order_amount` fills `amount_sdg` from the package's price on the server, so the client never sets the price.
  - The trigger rejects orders whose package does not belong to the chosen game.

2. Security hardening on new account tables
- profiles: anonymous visitors get no access. Signed-in users keep read access and can update only name, phone and avatar.
- topups: anonymous visitors get no access. Signed-in users keep read access and can create top-ups only with the allowed columns.
- The trigger function is not callable by clients.

3. Important notes
- Existing orders are unchanged.
- Guest order inserts keep working through the existing insert policy and column grants.
*/

ALTER TABLE public.orders ALTER COLUMN receipt_path DROP NOT NULL;

CREATE OR REPLACE FUNCTION public.set_order_amount()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  SELECT p.price_sdg INTO NEW.amount_sdg
  FROM public.packages p
  WHERE p.id = NEW.package_id AND p.game_id = NEW.game_id;

  IF NEW.amount_sdg IS NULL THEN
    RAISE EXCEPTION 'Package does not match the selected game';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.set_order_amount() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS orders_set_amount ON public.orders;
CREATE TRIGGER orders_set_amount
BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.set_order_amount();

REVOKE ALL ON public.profiles FROM anon, authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (name, phone, avatar_url) ON public.profiles TO authenticated;

REVOKE ALL ON public.topups FROM anon, authenticated;
GRANT SELECT ON public.topups TO authenticated;
GRANT INSERT (amount_sdg, method, transaction_number, receipt_path) ON public.topups TO authenticated;
