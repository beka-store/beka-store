/*
# Create profiles for signed-in accounts

1. New Tables
- `profiles`: one row per Supabase Auth account.
  - `id` (uuid, primary key, references auth.users)
  - `name`, `email`, `phone`, `avatar_url` (filled from sign-in and the profile form)
  - `role` ('customer' or 'owner'); only changed manually by the store owner
  - `balance` (wallet balance in SDG, starts at 0)
  - `points` (loyalty points, starts at 0)
  - `created_at`

2. Functions
- `is_owner()`: returns true when the signed-in account has role 'owner'.
- `handle_new_auth_user()`: trigger that creates a profile automatically for every new account (email, Google, or phone).

3. Security
- RLS enabled. Users can read only their own profile; the owner can read all profiles.
- Users can update only name, phone and avatar_url. Balance, points and role cannot be changed by the client.
- No client insert or delete on profiles (the trigger creates rows).

4. Notes
- Existing accounts are backfilled into profiles without changing auth data.
*/

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  email text,
  phone text CHECK (phone IS NULL OR phone ~ '^\+?[0-9]{7,15}$'),
  avatar_url text,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'owner')),
  balance integer NOT NULL DEFAULT 0 CHECK (balance >= 0),
  points integer NOT NULL DEFAULT 0 CHECK (points >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'owner'
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_owner() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_owner() TO authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone, avatar_url)
  VALUES (
    NEW.id,
    NULLIF(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''), ''),
    NEW.email,
    CASE WHEN NEW.phone LIKE '+249%' THEN '0' || substr(NEW.phone, 5) ELSE NULL END,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_auth_user() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

INSERT INTO public.profiles (id, name, email, avatar_url)
SELECT u.id,
       NULLIF(COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', ''), ''),
       u.email,
       u.raw_user_meta_data->>'avatar_url'
FROM auth.users u
ON CONFLICT (id) DO NOTHING;

GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (name, phone, avatar_url) ON public.profiles TO authenticated;

DROP POLICY IF EXISTS "read_own_or_owner_profiles" ON public.profiles;
CREATE POLICY "read_own_or_owner_profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.is_owner());

DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
CREATE POLICY "update_own_profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
