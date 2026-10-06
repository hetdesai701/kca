# Kiran Car Accessories

A premium, production-grade website for a car accessories & customization business
(Gandhinagar / Ahmedabad, India). Dark, cinematic design with gold metallic accents;
product showcase + inquiry/appointment conversion model (no e-commerce checkout).

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18 · Vite 5 · TypeScript · Tailwind CSS 3 · React Router 6 |
| Backend (Phase 2+) | Node.js · Express · TypeScript |
| Database (Phase 2+) | PostgreSQL via Prisma (SQLite fallback for local dev) |
| Validation | Zod |
| Auth | JWT / cookie session for the admin panel |
| Icons | Lucide React |

## Phase 1 — Interactive UI prototype (current)

Frontend-only build with realistic sample data. No backend, database or auth yet —
the admin area runs on a local mock session.

### Run the prototype

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
npm run preview    # serve the production build
```

### Demo admin credentials

- Email: `admin@kirancaraccessories.in`
- Password: `KiranAdmin@2026`

(Login at `/admin/login` — demo session stored in React state only.)

### What's included in Phase 1

- **Pages:** Home (hero, marquee, services, featured, before/after transformations,
  review carousel, trust strip, CTA), About (values, timeline), Services (category
  tabs), Products (search, category/brand/price filters, sorting, skeletons, empty
  states), Product Details (gallery, specs tabs, related), Gallery (masonry +
  lightbox), Reviews (distribution, filters, write-a-review with moderation flow),
  Contact (validated form, hours, map placeholder), Appointment (4-step wizard with
  Indian phone validation), Admin Login + full Dashboard UI (products, services,
  gallery, appointments, messages, reviews moderation, settings).
- **Interactions:** mobile hamburger menu, visual search/filter, before/after drag
  slider, gallery lightbox with keyboard nav, quote/inquiry modals, WhatsApp deep
  links, loading skeletons, empty states, error handling.
- **Validation:** Indian mobile format (`+91`/`0` optional, 10 digits starting 6–9),
  email format, required fields, min-length rules.

### Project structure

```
src/
  components/       Artwork, BeforeAfterSlider, Lightbox, InquiryModal, cards…
    layout/         Navbar, Footer, Logo, Layout, ScrollToTop
    ui/             Button, Badge, Field/Input/Select/Textarea, Modal, Tabs, Switch…
  context/          AdminContext (mock admin session + CRUD state)
  data/             products, services, gallery, reviews, transformations, settings
  pages/            Home, About, Services, Products, ProductDetails, Gallery,
                    Reviews, Contact, Appointment, NotFound
    admin/          AdminLogin, AdminDashboard
  types.ts          Shared domain types
  utils/            format, validation, form helpers
```

## Roadmap (upon approval)

- **Phase 2:** Express backend, REST API, centralized error handling
- **Phase 3:** PostgreSQL + Prisma schema & migrations (SQLite fallback)
- **Phase 4:** JWT authentication, protected admin routes
- **Phase 5:** Admin CRUD wired to the API
- **Phase 6:** Frontend API integration (replacing sample data), rate limiting, CORS
- **Phase 7:** Testing (unit + API), end-to-end QA
- **Phase 8:** Production build, README finalization, deployment guide

## Notes

- Secrets are never committed; `.env*` files are git-ignored.
- All imagery in Phase 1 is generated deterministic artwork (no external image
  dependencies), so the prototype works fully offline.
