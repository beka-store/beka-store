# Project memory

## Product intent & audience

- Arabic gaming top-up store (beka-store) for PUBG, Free Fire, and similar games.
- Users select packages, enter player ID + WhatsApp number, choose payment method, upload receipts.
- Target audience: Arabic-speaking gamers, specifically Sudanese dialect.
- Guest-friendly: no forced login for browsing, wallet, orders, or favorites.

## Brand personality & voice

- Dark, modern gaming aesthetic.
- All UI text in Arabic Sudanese dialect.
- Bilingual labels acceptable in navigation (Arabic primary, English secondary).

## Visual design & UX direction

- RTL layout; drawers/panels slide from the right.
- Hamburger button placed top-left (RTL convention).
- Dark theme throughout; modern, production-quality, non-cookie-cutter.
- Tech: Vite + React + JSX, Tailwind CSS, Lucide React icons only.
- `@/` path alias maps to `src/`.
- Sidebar drawer with 7 items: Home, Shop, Wallet, My Orders, Favorites, Contact Us, Login/Guest.
- Shop and Wallet scroll to anchor sections on home page (`#games`, `#wallet`).
- Contact Us opens WhatsApp.
- My Orders and Favorites are placeholder "coming soon" screens.

## Decisions, constraints & rationale

- Do not install extra UI/icon packages beyond Lucide React unless explicitly requested.
- Guest users can access all sidebar items; no login walls.
- Firebase auth still present but slated for removal; Supabase migration pending.
- `authErrors` helper restored with Arabic messages to unblock build.
- Checkout payment step had mismatched prop name; fixed minimally.
- Placeholder routes created for Orders and Favorites pending real implementations.
- Pending work: Supabase sign-in, guest checkout flow, wallet section completion, Firebase removal.

## Open questions & assumptions

- Supabase backend details (URL, keys, schema) not yet provided.
- Payment methods and receipt verification flow not fully defined.
- Real My Orders and Favorites pages need specs/data sources.
- Wallet section: currency, top-up methods, and balance logic unclear.
- Whether Firebase removal should proceed now or wait for Supabase parity.