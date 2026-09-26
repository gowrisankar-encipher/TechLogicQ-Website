# TechLogicQ Website

Marketing website for **TechLogicQ** — *Where Technology Meets Logic*. Learn • Build • Grow.

Built with Next.js (App Router), TypeScript and Tailwind CSS.

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about` | About Us |
| `/training` | Training & Skills |
| `/services` | Web Development Services |
| `/careers` | Job openings (managed from `/admin`) |
| `/contact` | Contact Us |
| `/admin` | Admin panel: add, edit and delete job openings |

The Academy page is hidden for now: its code is in `src/app/(site)/_academy/` (folders starting with `_` are not published). To bring it back, rename the folder to `academy` and uncomment the Academy lines in `src/lib/site.ts`, `src/components/Footer.tsx` and `src/app/(site)/page.tsx`.

`/sitemap.xml` and `/robots.txt` are generated from `src/app/sitemap.ts` and `src/app/robots.ts`.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run create-admin         # creates the admin login in MongoDB
npm run dev                  # http://localhost:3000
npm run lint
npm run build && npm start
```

### Environment variables (`.env.local`)

| Variable | What it's for |
| --- | --- |
| `ADMIN_SESSION_SECRET` | Random string, 32+ characters (`openssl rand -hex 32`). Signs the admin login cookie. |
| `SMTP_USER` / `SMTP_PASS` | Gmail address and a Google **App password**. Used to email contact form messages. |
| `CONTACT_TO_EMAIL` | Inbox that receives contact form messages (defaults to `SMTP_USER`). |
| `MONGODB_URI` | MongoDB Atlas connection string. Stores the admin account and job openings. |
| `MONGODB_DB` | Database name (default `techlogicq`). |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for canonical links, Open Graph and the sitemap. |

`.env.local` is ignored by git. Never commit passwords.

## Admin panel

Go to `/admin`, sign in, and add, edit or delete job openings. Changes appear on `/careers` straight away.
There is a single admin account and no public sign-up.

### Creating the admin login

The admin email and password are stored only in MongoDB (`admins` collection, password hashed with scrypt),
never in `.env.local`. With `MONGODB_URI` set in `.env.local`, run:

```bash
npm run create-admin
```

It asks for the admin email and password (the password is hidden as you type) and saves them to the database.
Running it again resets the password. Once signed in, you can also change the password at `/admin/password`
(the key icon in the admin header).

### Storage

- **Admin account**: MongoDB `admins` collection.
- **Job openings**: MongoDB `jobs` collection. Without `MONGODB_URI` they fall back to `data/jobs.json`,
  but the admin panel needs MongoDB, so set it.
- In MongoDB Atlas, under **Network Access**, allow the IP address of wherever the site runs
  (your computer while developing, and your host in production; Vercel needs `0.0.0.0/0`).

## Where to edit content

- `src/lib/site.ts` — site URL, contact details, social links, navigation.
- `src/data/content.ts` — feature cards, technologies, courses, services, job listings.
- `public/` — logo and Open Graph image.

## Placeholders to replace before launch

- **Social links** (`src/lib/site.ts`): currently point to the Instagram / LinkedIn / YouTube home pages.
- **Site URL**: set `NEXT_PUBLIC_SITE_URL`.

## Contact form

The form posts to `/api/contact`, which validates the input and emails it through Gmail SMTP using
`SMTP_USER` / `SMTP_PASS`. If those aren't set, visitors see a message asking them to email or call instead.
