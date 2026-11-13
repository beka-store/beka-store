/*
# Update store catalog to the new Sudanese pound prices

Plain-English summary: replaces the example games and prices with the real catalog. Free Fire, PUBG Mobile, Yalla Ludo, and US Visa are shown with Sudanese pound prices. Mobile Legends, Call of Duty, and Fortnite are hidden from the store. Visa items and games are removed from the old VIP list.

## 1. New games
- `ludo` (Yalla Ludo) and `us-visa` (US Visa) are added to the games list.

## 2. Modified data
- `games`: prices and display order are kept for the four games that stay. Mobile Legends, Call of Duty, and Fortnite are set to inactive, so they no longer appear. No rows are deleted, so existing orders keep their references.
- `packages`: every old package is set to inactive. The new packages are inserted or updated.

## 3. Security
- No changes to access rules, grants, or policies.

## 4. Important notes
1. Safe to re-run: inserts use fixed ids with ON CONFLICT updates, and status changes are fixed values.
2. Prices are in Sudanese pounds (SDG).
*/

INSERT INTO games (id, name_ar, name_en, accent_color, sort_order, is_active) VALUES
  ('ludo', 'يلا لودو', 'Yalla Ludo', '#7dd3fc', 3, true),
  ('us-visa', 'فيزا أمريكية', 'US Visa', '#c4b5fd', 4, true)
ON CONFLICT (id) DO UPDATE SET
  name_ar = EXCLUDED.name_ar,
  name_en = EXCLUDED.name_en,
  accent_color = EXCLUDED.accent_color,
  sort_order = EXCLUDED.sort_order,
  is_active = true;

UPDATE games SET sort_order = 1, is_active = true WHERE id = 'pubg-mobile';
UPDATE games SET sort_order = 2, is_active = true WHERE id = 'free-fire';
UPDATE games SET is_active = false WHERE id IN ('mobile-legends', 'call-of-duty', 'fortnite');

UPDATE packages SET is_active = false;

INSERT INTO packages (id, game_id, label_ar, price_sdg, sort_order, is_active) VALUES
  ('ff-110', 'free-fire', '100 + 10 جوهرة', 11000, 1, true),
  ('ff-221', 'free-fire', '210 + 21 جوهرة', 21200, 2, true),
  ('ff-584', 'free-fire', '530 + 53 جوهرة', 53200, 3, true),
  ('ff-1188', 'free-fire', '1080 + 108 جوهرة', 106400, 4, true),
  ('ff-2420', 'free-fire', '2200 + 220 جوهرة', 215000, 5, true),
  ('pubg-60', 'pubg-mobile', '60 شدة', 10000, 1, true),
  ('pubg-300', 'pubg-mobile', '300 + 30 شدة', 50200, 2, true),
  ('pubg-600', 'pubg-mobile', '600 + 60 شدة', 100600, 3, true),
  ('pubg-1500', 'pubg-mobile', '1500 + 300 شدة', 251500, 4, true),
  ('pubg-3000', 'pubg-mobile', '3000 + 850 شدة', 503100, 5, true),
  ('ludo-2', 'ludo', '2 دولار', 23000, 1, true),
  ('ludo-5', 'ludo', '5 دولار', 57000, 2, true),
  ('ludo-10', 'ludo', '10 دولار', 113000, 3, true),
  ('visa-0', 'us-visa', 'فيزا 0 دولار', 2000, 1, true)
ON CONFLICT (id) DO UPDATE SET
  game_id = EXCLUDED.game_id,
  label_ar = EXCLUDED.label_ar,
  price_sdg = EXCLUDED.price_sdg,
  sort_order = EXCLUDED.sort_order,
  is_active = true;
