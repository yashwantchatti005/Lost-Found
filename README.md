# College Lost & Found — HTML + CSS + JS + Supabase

No Java, no server, no build step. Pure static site + Supabase backend.

## Setup (5 minutes)

1. Create a free project at https://supabase.com
2. Open **SQL Editor → New query**, paste everything from `supabase-setup.sql`, click **Run**.
   (Creates the `found_items` table, security rules, and the `item-images` storage bucket.)
3. **Project Settings → API** → copy the *Project URL* and *anon public key* into `js/config.js`.
4. **Authentication → Users → Add user** → create your admin (email + password).
   Tick "Auto Confirm User". This is what you log in with on `login.html`.
5. Run it: open `index.html`, or better serve it (`npx serve .` / VS Code Live Server).
   Deploy free on Netlify, Vercel, GitHub Pages or Cloudflare Pages — just drag the folder.

## Pages
| File | What it does |
|---|---|
| index.html | Landing page with live stats |
| browse.html | Public list, search + Available/Claimed filter |
| report.html | Report a found item (photo goes to Supabase Storage) |
| login.html | Admin sign in (Supabase Auth) |
| admin.html | Admin dashboard: mark claimed, delete, search |

## Security notes
- Only logged-in admins can update/delete (Row Level Security enforces it server-side).
- The anon key is safe to expose; never put the `service_role` key in this project.
- Your old project had a Railway DB password committed in `application.properties` — rotate it.
