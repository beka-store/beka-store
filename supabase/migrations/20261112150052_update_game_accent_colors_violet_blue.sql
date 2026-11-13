/*
# Update game accent colors to the violet and blue palette

Plain-English summary: each game card and package icon has its own accent color. This migration changes those colors so they match the violet and blue style of the new BEKA STORE logo.

## 1. Modified tables
- `games`: `accent_color` is updated for all five seeded games. No rows are added or removed.

## 2. Security
- No changes to access rules, grants, or policies.

## 3. Important notes
1. Safe to re-run: each statement sets a fixed color for a fixed game id.
*/

UPDATE games SET accent_color = '#a78bfa' WHERE id = 'pubg-mobile';
UPDATE games SET accent_color = '#60a5fa' WHERE id = 'free-fire';
UPDATE games SET accent_color = '#c084fc' WHERE id = 'mobile-legends';
UPDATE games SET accent_color = '#38bdf8' WHERE id = 'call-of-duty';
UPDATE games SET accent_color = '#818cf8' WHERE id = 'fortnite';
