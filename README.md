# Lost & Found ✨ — College Campus Portal

A simple web portal where students can post lost and found items, browse listings, and get items back to their owners. Finders can call or WhatsApp the owner directly, and the admin office manages everything from a dashboard.

**Live site:** https://lost-found-weld.vercel.app/
**Developed by:** [Yaswanth Chatti](https://yashwant-chatti-portfolio.vercel.app/)

---

## Features

### Public
- **Report Lost Item:** post what you lost with a photo, location, date and your phone number.
- **Report Found Item:** post what you found with a photo and location. The owner collects it from the admin office.
- **Browse Found Items:** search and filter by name, category, location, and status (Available / Claimed).
- **Browse Lost Items:** search and filter (Still Lost / Recovered). Finders can tap **Call** or **WhatsApp** to contact the owner.
- **"I found this" button:** finders can send their name, phone and a message about where the item is. The admin is notified.
- **Home page:** live stats (items found, still missing, back with owners) and the latest posts.

### Admin
- Secure login (Supabase Auth).
- Dashboard with **Found** and **Lost** tabs.
- Summary cards: total, waiting, claimed/recovered, return rate.
- Search and status filters.
- Mark items as **Claimed** or **Recovered**, or delete them (the image is removed from storage too).
- **New finder reports** panel with a notification badge, Call/WhatsApp buttons, *Mark recovered* and *Dismiss*.
- Photo lightbox and mobile-friendly card layout.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, vanilla JavaScript |
| Icons / Fonts | Bootstrap Icons, Google Fonts (Syne, Plus Jakarta Sans) |
| Backend | [Supabase](https://supabase.com) (PostgreSQL, Auth, Storage, Row Level Security) |
| Hosting | [Vercel](https://vercel.com) |

---

## Project Structure

```
.
├── index.html          # Home page
├── browse.html         # Found items listing
├── lost-items.html     # Lost items listing + "I found this" form
├── report.html         # Report a found item
├── lost.html           # Report a lost item
├── login.html          # Admin login
├── admin.html          # Admin dashboard
├── css/
│   ├── browse.css
│   └── admin.css
└── js/
    ├── config.js       # Supabase URL, anon key, image bucket name
    └── supabase.js     # Supabase client + helpers (fetchItems, imageUrl, esc, fmtDate)
```

> Adjust file names above if yours differ (for example, the admin page).

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Create the tables `found_items`, `lost_items` and `lost_finds`.
3. Create a **public** Storage bucket for item photos.
4. Create an admin user under **Authentication → Users**.
5. Enable Row Level Security and add policies (public can insert/select where needed; only `authenticated` can update/delete).

`lost_finds` table and policies:

```sql
create table if not exists public.lost_finds (
  id            bigint generated always as identity primary key,
  lost_item_id  bigint not null references public.lost_items(id) on delete cascade,
  finder_name   text not null,
  finder_phone  text not null,
  message       text check (char_length(message) <= 500),
  seen          boolean not null default false,
  created_at    timestamptz not null default now()
);

alter table public.lost_finds enable row level security;

create policy "public insert finds" on public.lost_finds for insert to anon, authenticated with check (true);
create policy "admin read finds"    on public.lost_finds for select to authenticated using (true);
create policy "admin update finds"  on public.lost_finds for update to authenticated using (true) with check (true);
create policy "admin delete finds"  on public.lost_finds for delete to authenticated using (true);

grant usage on schema public to anon, authenticated;
grant insert on public.lost_finds to anon;
grant select, insert, update, delete on public.lost_finds to authenticated;
```

### 3. Configure the app

Edit `js/config.js` with your own values:

```js
window.SUPABASE_URL  = 'https://<your-project>.supabase.co';
window.SUPABASE_ANON = '<your-anon-public-key>';
window.IMAGE_BUCKET  = '<your-bucket-name>';
```

> Only use the **anon** key in frontend code. Never expose the `service_role` key.

### 4. Run locally

No build step needed. Serve the folder with any static server:

```bash
npx serve .
# or
python -m http.server 5500
```

Then open `http://localhost:5500`.

---

## Deployment

1. Push the project to GitHub.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Framework preset: **Other** (static site). No build command, output directory is the root.
4. Deploy.

---

## How It Works

**If you lost something**
1. Check the Found Items page.
2. Post it as lost with details and your phone number.
3. Finders call or WhatsApp you, or use "I found this" to notify the admin.

**If you found something**
1. Post it with a photo and the location.
2. Admin reviews and lists it.
3. The owner shows proof of ownership at the admin office.

---

## Troubleshooting

- **Admin doesn't see finder reports:** make sure you're logged in (RLS only allows `authenticated` to read `lost_finds`), and check the browser console for errors.
- **Descriptions not showing:** confirm the `description` column exists and that `fetchItems()` selects it (or uses `select('*')`).
- **Images not loading:** check the bucket is public and `IMAGE_BUCKET` matches its name.

---

## Developer

**Yaswanth Chatti**
🌐 Portfolio: https://yashwant-chatti-portfolio.vercel.app/

## Contact

Admin Office, Block A, Room 105

© 2026 College Lost & Found · Developed by [Yaswanth Chatti](https://yashwant-chatti-portfolio.vercel.app/)
