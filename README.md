# Rana Furniture · Appointment Booking Demo

A Typeform-style appointment booking flow for Rana Furniture showrooms. Single-page HTML, no framework, served from Vercel with one serverless function that writes each booking to Airtable.

Live: https://rana-appointment-demo.vercel.app

## Project layout

```
index.html          # the whole UI (styles + JS inline)
assets/rana-logo.png
api/book.js         # serverless function — validates + writes to Airtable
.env.example        # template for required env vars
```

## How it works

1. Visitor walks through 5 steps: what they're looking for → occasion → closest showroom (Leaflet map + zip auto-selects nearest) → date + time (month calendar) → name / phone / email with inline validation.
2. On submit, the browser POSTs to `/api/book`.
3. The serverless function validates the payload and creates a record in the Airtable table.
4. Confirmation screen renders with the store details.

## Airtable setup

- Base: `appHczu5h0qvrLoEX` (rename "Untitled Base" to something like `AC · Client Bookings` if you want to reuse it for other clients)
- Table: `Rana · Showroom Bookings` (`tblNxlk5DM8tYFHZn`)
- Fields: First Name, Last Name, Phone, Email, Store, Date, Time of Day, Looking For, Occasion, Zip Code, Note, Status (defaults to `New`), Submitted At

## Local dev

```bash
cp .env.example .env         # then fill in AIRTABLE_TOKEN
npm install -g vercel        # if you don't have it
vercel dev                   # serves index.html + runs /api/book locally
```

Open http://localhost:3000.

## Deploy

```bash
vercel deploy --prod
```

The project is already linked to the Vercel project `linktree-scrapers-projects/rana-appointment-demo` (see `.vercel/project.json`). The production URL (`rana-appointment-demo.vercel.app`) is public; preview URLs are gated by Vercel team SSO.

## Env vars on Vercel

`AIRTABLE_TOKEN` is set on the Production environment. To update:

```bash
vercel env rm AIRTABLE_TOKEN production
vercel env add AIRTABLE_TOKEN production
```

## Reusing this for other clients

The UI is hardcoded with Rana's brand colors, logo, store list, and zip code lookup table. To adapt for another client:

1. Swap the logo in `assets/`
2. Update brand tokens in the `:root` block of `index.html`
3. Replace the `stores` array and `zipCentroids` dictionary in the `<script>` block
4. Create a new Airtable table with the same schema and update `AIRTABLE_TABLE_ID` in `api/book.js`
