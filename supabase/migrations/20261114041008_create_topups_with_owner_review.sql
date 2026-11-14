/*
# Wallet top-up requests with owner-only review

1. New Tables
- `topups`: wallet top-up requests sent by signed-in users.
  - `user_id` (defaults to the signed-in account)
  - `amount_sdg`, `method` ('fawry' or 'mycashi'), `transaction_number`
  - `receipt_path` (screenshot stored in the private receipts bucket)
  - `status` ('pending', 'approved', 'rejected'), `created_at`, `reviewed_at`

2. Functions
- `review_topup(topup_id, approve)`: owner-only. Approving adds the amount to the user's wallet balance and marks the request approved. Rejecting only marks it rejected. Already reviewed requests cannot be changed.

3. Security
- RLS enabled. Users see only their own top-ups; the owner sees all.
- Users can create top-ups only for themselves, and only with status 'pending'.
- No client update or delete. Reviews happen only through review_topup.
- Owner can read receipt screenshots in the receipts bucket.
*/

CREATE TABLE IF NOT EXISTS public.topups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_sdg integer NOT NULL CHECK (amount_sdg BETWEEN 1 AND 1000000),
  method text NOT NULL CHECK (method IN ('fawry', 'mycashi')),
  transaction_number text NOT NULL CHECK (char_length(transaction_number) BETWEEN 3 AND 60),
  receipt_path text NOT NULL CHECK (char_length(receipt_path) BETWEEN 1 AND 300),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);

CREATE INDEX IF NOT EXISTS topups_user_id_idx ON public.topups (user_id);
CREATE INDEX IF NOT EXISTS topups_status_created_idx ON public.topups (status, created_at DESC);

ALTER TABLE public.topups ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.topups TO authenticated;
GRANT INSERT (amount_sdg, method, transaction_number, receipt_path) ON public.topups TO authenticated;

DROP POLICY IF EXISTS "read_own_or_owner_topups" ON public.topups;
CREATE POLICY "read_own_or_owner_topups"
ON public.topups FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_owner());

DROP POLICY IF EXISTS "insert_own_pending_topups" ON public.topups;
CREATE POLICY "insert_own_pending_topups"
ON public.topups FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE OR REPLACE FUNCTION public.review_topup(p_topup_id uuid, p_approve boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_row public.topups%ROWTYPE;
BEGIN
  IF NOT public.is_owner() THEN
    RAISE EXCEPTION 'NOT_OWNER' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_row FROM public.topups WHERE id = p_topup_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'NOT_FOUND';
  END IF;
  IF v_row.status <> 'pending' THEN
    RAISE EXCEPTION 'ALREADY_REVIEWED';
  END IF;

  IF p_approve THEN
    UPDATE public.profiles SET balance = balance + v_row.amount_sdg WHERE id = v_row.user_id;
    UPDATE public.topups SET status = 'approved', reviewed_at = now() WHERE id = p_topup_id;
  ELSE
    UPDATE public.topups SET status = 'rejected', reviewed_at = now() WHERE id = p_topup_id;
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.review_topup(uuid, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.review_topup(uuid, boolean) TO authenticated;

DROP POLICY IF EXISTS "owner_read_receipts" ON storage.objects;
CREATE POLICY "owner_read_receipts"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'receipts' AND public.is_owner());
