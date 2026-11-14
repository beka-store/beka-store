# Project memory

## Product intent & audience

- Arabic gaming top-up store ("beka-store") targeting mobile/Android users primarily.
- Users select game packages (PUBG, Free Fire), enter player ID + WhatsApp number, choose payment method, upload payment receipt.
- Includes sign-in via Google and phone (OTP) through Firebase Auth.

## Brand personality & voice

- Arabic-first interface; all user-facing messages in Arabic.
- Tone: straightforward, helpful, production-grade — not generic or templated.

## Visual design & UX direction

- Beautiful, non-cookie-cutter UI; production-worthy by default.
- Tailwind CSS for styling; Lucide React for all icons.
- React hooks; JSX with `@/` path alias (`src/`).
- Sign-in uses full-page redirect (not popup) to work on Android WebView/browsers.
- Forms collect: player ID, WhatsApp number, payment method selection, payment receipt upload.

## Decisions, constraints & rationale

- Firebase Auth was never configured (empty placeholders) — caused all sign-in failures.
- Google sign-in switched from popup to full-page redirect for Android compatibility.
- Sign-in buttons disabled with Arabic notice when Firebase not yet set up (graceful degradation).
- Arabic error messages added for sign-in failures.
- Build and type check pass after fixes.
- **Blocked:** Firebase config values still needed from user (API key, auth domain, project ID, storage bucket, sender ID, app ID).
- **Blocked:** Google and Phone sign-in providers must be enabled in Firebase console.
- **Blocked:** Store web domain must be added to Firebase authorized domains.

## Open questions & assumptions

- Firebase config values pending from owner.
- Whether Firestore/database rules need publishing once config is provided (assumed yes).
- Which payment methods are supported (not yet detailed in UI context).
- Whether order data is stored in Firebase or elsewhere (assumed Firebase once configured).