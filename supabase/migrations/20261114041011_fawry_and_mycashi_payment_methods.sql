/*
# Two payment methods (Fawry and My Cashi) and checkout name

1. Payment methods
- Only "Fawry" (account 52113932) and "My Cashi" (account 400294324) are active.
- Bankak, Ocash and USDT are deactivated, not deleted, because past orders reference them.
- Owner can change account numbers and active status from the admin panel.

2. Orders
- New `customer_name` column, filled at checkout.
- New `user_id` column, filled automatically when the buyer is signed in (empty for guests).

3. Security
- Owner can update only account_value and is_active on payment methods.
- Anonymous and signed-in buyers can set customer_name on new orders.
*/

UPDATE public.payment_methods SET is_active = false WHERE id NOT IN ('fawry', 'mycashi');

INSERT INTO public.payment_methods (id, name_ar, account_label_ar, account_value, instructions_ar, sort_order, is_active)
VALUES
  ('fawry', 'فوري', 'رقم حساب فوري', '52113932', 'حوّل المبلغ إلى رقم فوري ثم ارفع صورة إشعار التحويل.', 1, true),
  ('mycashi', 'ماي كاشي', 'رقم حساب ماي كاشي', '400294324', 'حوّل المبلغ إلى رقم ماي كاشي ثم ارفع صورة إشعار التحويل.', 2, true)
ON CONFLICT (id) DO NOTHING;

UPDATE public.payment_methods SET is_active = true WHERE id IN ('fawry', 'mycashi');

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name text
  CHECK (customer_name IS NULL OR char_length(customer_name) BETWEEN 2 AND 80);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id uuid
  REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT auth.uid();

GRANT INSERT (customer_name) ON public.orders TO anon, authenticated;

GRANT UPDATE (account_value, is_active) ON public.payment_methods TO authenticated;

DROP POLICY IF EXISTS "owner_update_payment_methods" ON public.payment_methods;
CREATE POLICY "owner_update_payment_methods"
ON public.payment_methods FOR UPDATE
TO authenticated
USING (public.is_owner())
WITH CHECK (public.is_owner());
