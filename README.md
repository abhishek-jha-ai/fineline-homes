# Fine Line Homes — Website Concept

A Next.js 16 + TypeScript + Tailwind CSS v4 site for Fine Line Homes. It covers new home construction in Pennsylvania, Southern New York and the Triad region of North Carolina.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start   # production build
```

## Where things live

| What | Where |
| --- | --- |
| Site name, URL, contact phone/email, concept badge, indexing | `src/config/site.ts` |
| Consultation wizard options + integration notes | `src/config/consultation.ts` |
| Consultation API (CRM / webhook forwarding) | `src/app/api/consultation/route.ts` |
| Home plan data (**sample data**, replace before launch) | `src/data/plans.ts` |
| Regions (offices, contacts, communities slots) | `src/data/regions.ts` |
| Gallery items + filters | `src/data/gallery.ts` |
| Image registry | `src/data/images.ts` → files in `src/assets/images/` |
| Metadata, Open Graph, Twitter, JSON-LD | `src/app/layout.tsx` |
| OG image (1200×630) | `public/og-fine-line.jpg` |
| Favicon / app icon / Apple touch icon | `src/app/favicon.ico`, `src/app/icon.png`, `src/app/apple-icon.png` |
| Analytics events | `src/lib/analytics.ts` (`trackEvent`) |
| Plan matching logic | `src/lib/planMatch.ts` |

## Going live checklist

1. Replace `plans` in `src/data/plans.ts` with real plans and set `PLANS_ARE_SAMPLE = false`.
2. Add a verified phone/email in `src/config/site.ts`. Phone links and `phone_clicked` tracking appear automatically.
3. Set `showConceptBadge: false` and `allowIndexing: true` in `src/config/site.ts`.
4. Set `NEXT_PUBLIC_SITE_URL` to the real domain. Canonical and OG URLs use it.
5. Configure lead delivery with environment variables (any combination):
   - `CONSULTATION_WEBHOOK_URL`: generic JSON webhook (Zapier, Make, n8n, custom CRM)
   - `GHL_WEBHOOK_URL`: GoHighLevel inbound webhook
   - `HUBSPOT_PORTAL_ID` + `HUBSPOT_FORM_GUID`: HubSpot Forms API
   - `LEAD_NOTIFY_WEBHOOK_URL`: email/SMS alert flow (for example Zapier → Gmail + Twilio)
   - Optional scheduler link: `consultationConfig.schedulingUrl` (Calendly, Cal.com, GHL calendar)
6. Add analytics script tags (GTM, GA4, Meta Pixel, Vercel Analytics). `trackEvent` already sends to each of them when present.

## Analytics events

`consultation_started`, `region_selected`, `plan_viewed`, `plan_filter_used`, `gallery_viewed`, `consultation_submitted`, `phone_clicked`
