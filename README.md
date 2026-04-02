# MO Marketplace

A clean, production-grade Next.js 14 marketplace frontend built for the Sago Mente Frontend Engineer Assessment.

**Live Demo:** https://mo-marketplace.vercel.app _(deploy and update this URL)_

---

## ⚡ Quick Start

```bash
git clone https://github.com/your-username/mo-marketplace-web
cd mo-marketplace-web

cp .env.local.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🛠 Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 App Router | Required; RSC + nested layouts |
| Language | TypeScript (strict) | Full type safety across API + UI |
| Styling | Tailwind CSS | Utility-first, zero runtime |
| State | Zustand + persist | Lightweight, SSR-safe, localStorage sync |
| Forms | React Hook Form + Zod | Schema-driven, field-level errors |
| HTTP | Axios | Interceptor support for JWT injection |
| Notifications | Sonner | Lightweight, composable toasts |
| Icons | Lucide React | Tree-shakable, consistent |

---

## 🏗 Architecture

### Auth Flow
- JWT stored in `localStorage` via Zustand `persist` middleware
- Axios request interceptor reads `mo_token` and attaches `Authorization: Bearer <token>`
- Axios **response** interceptor catches 401 globally → fires a `CustomEvent('mo:auth:expired')`
- `AuthProvider` (client component) listens for that event → calls `logout()` → toasts → redirects to `/login`
- This avoids circular imports between the store and the interceptor

### Form Validation
- All forms use `react-hook-form` with `zodResolver`
- Schemas live in `src/lib/validations.ts`
- Field errors surface inline below each input
- Duplicate variant check runs via Zod `.refine()` on the array + real-time visual highlighting via `useWatch`

### Edge Cases
| Scenario | Handling |
|---|---|
| All variants OOS | Quick Buy disabled, "Out of Stock" button label |
| Duplicate variant combo | Zod schema error + red border highlight in create form |
| 401 / JWT expired | Token cleared, toast shown, redirect to `/login` |
| Network error | Error toast with retry CTA on listing page |
| No products | Empty state with CTA (create if authed, register if not) |
| Invalid form | Field-level errors before submission, no network call |
| Quick Buy unauthenticated | Toast + redirect to `/login?redirect=/products/{id}` |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── products/
│   │   ├── page.tsx              # Listing with search
│   │   ├── [id]/page.tsx         # Detail + variant selector + quick buy
│   │   └── create/page.tsx       # Protected create form
│   ├── layout.tsx                # Root layout + providers + fonts
│   ├── page.tsx                  # Redirect → /products
│   └── globals.css               # Design tokens, animations, utilities
├── components/
│   ├── ui/
│   │   ├── Button.tsx            # Multi-variant button with loading state
│   │   ├── Input.tsx             # Labeled input with error/hint
│   │   ├── Badge.tsx             # Status badges (gold/crimson/muted/acid)
│   │   └── Skeleton.tsx          # Shimmer skeletons for cards and detail
│   ├── products/
│   │   ├── ProductCard.tsx       # Card with hover effects, price range
│   │   ├── VariantSelector.tsx   # Grid selector, OOS disabled + indicator
│   │   └── QuickBuyBtn.tsx       # Auth-aware buy button
│   └── layout/
│       ├── Navbar.tsx            # Responsive navbar, auth-aware
│       └── AuthProvider.tsx      # Session rehydration + 401 listener
├── lib/
│   ├── api.ts                    # Axios client + interceptors + error helper
│   ├── validations.ts            # All Zod schemas
│   └── utils.ts                  # cn() helper
├── store/
│   └── authStore.ts              # Zustand auth store with persistence
└── types/
    └── index.ts                  # TypeScript interfaces + helper functions
```

---

## 🚀 Deployment (Vercel)

1. Push to GitHub
2. Import to [vercel.com](https://vercel.com)
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://mo-marketplace-api-production.up.railway.app`
4. Deploy

---

## Assumptions

- Product images are not part of the API spec; icon placeholders are used
- Quick Buy quantity is hardcoded to `1` — the spec does not mention a quantity picker
- Client-side search filter on the product listing is a UX addition not in the spec
- The `(auth)` route group uses the root layout (Navbar is shown on auth pages intentionally for navigation back)

## Known Limitations

- No pagination — the API appears to return all products in a single response
- No product image upload capability
- No edit/delete product UI (API endpoints exist but were not in the assessment scope)
