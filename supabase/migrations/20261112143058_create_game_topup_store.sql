/*
# Create game top-up store schema

Plain-English summary: sets up everything the top-up store needs to show games, their packages and prices, the payment methods, and to save customer orders together with their transfer receipt screenshot.

## 1. New Tables
- `games`: the games shown on the home page (Arabic and English name, accent color, display order, active flag).
- `packages`: top-up packages for each game (label such as "60 شدة", price in Sudanese pounds, display order, active flag).
- `payment_methods`: the ways a customer can pay (bank, Ocash, USDT) with the account details to show.
- `orders`: one row per customer order (game, package, player ID, WhatsApp number, payment method, amount, receipt file path, status).

## 2. Functions and triggers
- `set_order_amount()` fills in the price of an order from the chosen package, so customers can never pick their own price. It also rejects packages that are inactive or do not belong to the chosen game.

## 3. Storage
- Private bucket `receipts` for transfer screenshots: 5 MB max, JPEG / PNG / WebP only.

## 4. Security
- RLS enabled on every table.
- Catalog tables (`games`, `packages`, `payment_methods`) are readable by visitors (anon and signed-in) only when active. Nobody can change them from the app.
- `orders` accept inserts from visitors only, and only for the listed columns. Visitors cannot read orders back, and cannot set amount or status. Status starts as `pending`.
- Receipt uploads are allowed only into the `receipts` bucket. Receipts cannot be read back by visitors.

## 5. Important notes
1. The seed prices and payment account numbers are placeholders and should be replaced with the real values.
2. Seed rows use stable text ids so this migration is safe to replay on a new database.
*/

CREATE TABLE IF NOT EXISTS games (
  id text PRIMARY KEY,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  accent_color text NOT NULL DEFAULT '#facc15',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS packages (
  id text PRIMARY KEY,
  game_id text NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  label_ar text NOT NULL,
  price_sdg integer NOT NULL CHECK (price_sdg > 0),
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS packages_game_id_idx ON packages (game_id);

CREATE TABLE IF NOT EXISTS payment_methods (
  id text PRIMARY KEY,
  name_ar text NOT NULL,
  account_label_ar text NOT NULL,
  account_value text NOT NULL,
  instructions_ar text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id text NOT NULL REFERENCES games(id),
  package_id text NOT NULL REFERENCES packages(id),
  player_id text NOT NULL CHECK (char_length(player_id) BETWEEN 3 AND 50),
  whatsapp text NOT NULL CHECK (whatsapp ~ '^\+?[0-9]{7,15}$'),
  payment_method_id text NOT NULL REFERENCES payment_methods(id),
  amount_sdg integer NOT NULL CHECK (amount_sdg > 0),
  receipt_path text NOT NULL CHECK (char_length(receipt_path) BETWEEN 1 AND 300),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);

CREATE OR REPLACE FUNCTION set_order_amount()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  package_price integer;
BEGIN
  SELECT price_sdg INTO package_price
  FROM packages
  WHERE id = NEW.package_id AND game_id = NEW.game_id AND is_active;

  IF package_price IS NULL THEN
    RAISE EXCEPTION 'Package % is not available for game %', NEW.package_id, NEW.game_id;
  END IF;

  NEW.amount_sdg := package_price;
  NEW.status := 'pending';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_set_amount ON orders;
CREATE TRIGGER orders_set_amount
BEFORE INSERT ON orders
FOR EACH ROW EXECUTE FUNCTION set_order_amount();

ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON games TO anon, authenticated;
GRANT SELECT ON packages TO anon, authenticated;
GRANT SELECT ON payment_methods TO anon, authenticated;
GRANT INSERT (game_id, package_id, player_id, whatsapp, payment_method_id, receipt_path) ON orders TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_active_games" ON games;
CREATE POLICY "public_read_active_games" ON games FOR SELECT
  TO anon, authenticated USING (is_active);

DROP POLICY IF EXISTS "public_read_active_packages" ON packages;
CREATE POLICY "public_read_active_packages" ON packages FOR SELECT
  TO anon, authenticated USING (is_active);

DROP POLICY IF EXISTS "public_read_active_payment_methods" ON payment_methods;
CREATE POLICY "public_read_active_payment_methods" ON payment_methods FOR SELECT
  TO anon, authenticated USING (is_active);

DROP POLICY IF EXISTS "public_create_orders" ON orders;
CREATE POLICY "public_create_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('receipts', 'receipts', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

DROP POLICY IF EXISTS "public_upload_receipts" ON storage.objects;
CREATE POLICY "public_upload_receipts" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'receipts');

INSERT INTO games (id, name_ar, name_en, accent_color, sort_order) VALUES
  ('pubg-mobile', 'ببجي موبايل', 'PUBG Mobile', '#facc15', 1),
  ('free-fire', 'فري فاير', 'Free Fire', '#f97316', 2),
  ('mobile-legends', 'موبايل ليجندز', 'Mobile Legends', '#38bdf8', 3),
  ('call-of-duty', 'كول أوف ديوتي', 'Call of Duty Mobile', '#a3e635', 4),
  ('fortnite', 'فورتنايت', 'Fortnite', '#e5e7eb', 5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO packages (id, game_id, label_ar, price_sdg, sort_order) VALUES
  ('pubg-60', 'pubg-mobile', '60 شدة', 3500, 1),
  ('pubg-325', 'pubg-mobile', '325 شدة', 17000, 2),
  ('pubg-660', 'pubg-mobile', '660 شدة', 33000, 3),
  ('pubg-1800', 'pubg-mobile', '1800 شدة', 85000, 4),
  ('ff-100', 'free-fire', '100 جوهرة', 3000, 1),
  ('ff-310', 'free-fire', '310 جوهرة', 9000, 2),
  ('ff-520', 'free-fire', '520 جوهرة', 14500, 3),
  ('ff-1060', 'free-fire', '1060 جوهرة', 28000, 4),
  ('ml-86', 'mobile-legends', '86 ألماسة', 4000, 1),
  ('ml-172', 'mobile-legends', '172 ألماسة', 8000, 2),
  ('ml-257', 'mobile-legends', '257 ألماسة', 12000, 3),
  ('ml-514', 'mobile-legends', '514 ألماسة', 23000, 4),
  ('cod-80', 'call-of-duty', '80 CP', 3500, 1),
  ('cod-400', 'call-of-duty', '400 CP', 15000, 2),
  ('cod-800', 'call-of-duty', '800 CP', 28000, 3),
  ('cod-2000', 'call-of-duty', '2000 CP', 65000, 4),
  ('fn-1000', 'fortnite', '1000 V-Bucks', 12000, 1),
  ('fn-2800', 'fortnite', '2800 V-Bucks', 30000, 2),
  ('fn-5000', 'fortnite', '5000 V-Bucks', 50000, 3),
  ('fn-13500', 'fortnite', '13500 V-Bucks', 120000, 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO payment_methods (id, name_ar, account_label_ar, account_value, instructions_ar, sort_order) VALUES
  ('bankak', 'بنكك', 'رقم الحساب', 'PLACEHOLDER-BANKAK', 'حوّل المبلغ إلى رقم الحساب أعلاه ثم ارفع صورة إشعار التحويل.', 1),
  ('ocash', 'أوكاش', 'رقم أوكاش', 'PLACEHOLDER-OCASH', 'حوّل المبلغ إلى رقم أوكاش أعلاه ثم ارفع صورة إشعار التحويل.', 2),
  ('usdt', 'USDT', 'عنوان المحفظة (TRC20)', 'PLACEHOLDER-USDT', 'أرسل المبلغ بعملة USDT إلى العنوان أعلاه ثم ارفع صورة إشعار التحويل.', 3)
ON CONFLICT (id) DO NOTHING;
