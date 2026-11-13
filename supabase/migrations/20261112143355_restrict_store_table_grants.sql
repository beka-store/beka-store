/*
# Restrict table privileges to the minimum the store needs

Plain-English summary: the database gave the public app full read, write, and delete privileges on every store table by default. This migration removes those extra privileges so visitors can only do what the store needs.

## 1. Modified tables
- `games`, `packages`, `payment_methods`, `orders`: all existing table-level privileges for `anon` and `authenticated` are removed.

## 2. Re-granted privileges
- `games`, `packages`, `payment_methods`: SELECT only (row access is still limited to active rows by RLS).
- `orders`: INSERT only, on the customer-facing columns (game, package, player ID, WhatsApp, payment method, receipt path).

## 3. Security
- Visitors can no longer read, update, or delete orders at the privilege level, and cannot write to catalog tables.
- Existing row-level policies are unchanged.

## 4. Important notes
1. Safe to re-run: REVOKE and GRANT statements are idempotent.
2. Amount and status on orders are still set by the database trigger, not by the visitor.
*/

REVOKE ALL ON games, packages, payment_methods, orders FROM anon, authenticated;

GRANT SELECT ON games, packages, payment_methods TO anon, authenticated;
GRANT INSERT (game_id, package_id, player_id, whatsapp, payment_method_id, receipt_path) ON orders TO anon, authenticated;
