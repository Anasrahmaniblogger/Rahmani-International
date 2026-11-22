# Rahmani International — Official Website

Production-ready Next.js (App Router + TypeScript + Tailwind CSS) company website for **Rahmani International** (`https://rahmaniinternational.in`), designed as a strictly read-only static-first site deployed on **Vercel** via **GitHub** (zero databases, zero admin panels, zero public upload endpoints).

---

## 1. Manage Mobile Apps (Logo, URL & Details)

Edit your published apps in one dedicated folder:

- **App Catalog**: `content/apps/apps.json`
- **Optional Local App Icons**: `public/apps/logos/`
- **Guide**: `content/apps/README.md`

Committing updates to `content/apps/apps.json` automatically updates the Homepage portfolio, category filters, Featured Spotlight, 3D Hero screens, and SEO metadata on Vercel.

---

## 2. Manage Company Brand Logo

Replace the logo file in GitHub at:

```text
public/brand/logo.png
```

Commit and push — Vercel redeploys automatically and updates the logo across the Header, Homepage, Footer, Mobile Navigation, and browser icon.

---

## 3. Android Application Policy Files (`public/policies/`)

Android policy documents (Privacy Policy, Terms & Conditions, Refund Policy, Money-Back Guarantee, Cancellation Policy, Disclaimer, Data Safety, Advertising, App Permissions, Third-Party Services, Support, and Additional Policies) are stored under `public/policies/` and are **never listed or displayed anywhere on the website**.

- Full folder map & workflow: see [`docs/ANDROID_POLICIES_GUIDE.md`](docs/ANDROID_POLICIES_GUIDE.md)
- **URL Formula**: Drop `public/` and prepend `https://rahmaniinternational.in/`:
  - GitHub file: `public/policies/privacy-policy/multi-tool-app/index.html`
  - Public HTTPS URL: `https://rahmaniinternational.in/policies/privacy-policy/multi-tool-app/index.html`
  - GitHub file: `public/policies/terms-and-conditions/multi-tool-app/index.html`
  - Public HTTPS URL: `https://rahmaniinternational.in/policies/terms-and-conditions/multi-tool-app/index.html`
  - GitHub file: `public/policies/refund-policy/multi-tool-app/index.html`
  - Public HTTPS URL: `https://rahmaniinternational.in/policies/refund-policy/multi-tool-app/index.html`
  - GitHub file: `public/policies/money-back-guarantee/multi-tool-app/index.html`
  - Public HTTPS URL: `https://rahmaniinternational.in/policies/money-back-guarantee/multi-tool-app/index.html`

> **Important**: Never paste a `github.com/.../blob/...` source link into Google Play Console. Always use the deployed `https://rahmaniinternational.in/policies/...` HTTPS URL.

---

## 4. Security & Read-Only Architecture

- Visitors cannot modify company details, logos, app entries, content, configuration, or policy files from the browser.
- All site changes are authenticated and versioned exclusively through your GitHub repository and deployed automatically by Vercel.
- Security headers (`HSTS`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) are configured in `next.config.ts`.
- Note on static web delivery: public HTML, CSS, JavaScript, and images served to browsers can always be viewed or saved by visitors, so never place private credentials or sensitive data inside `public/` or client code.

---

## 5. Vercel Deployment

1. Push this repository to GitHub.
2. Import into Vercel (Next.js preset, build command `npm run build`).
3. Connect `rahmaniinternational.in` and `www.rahmaniinternational.in` in **Project Settings → Domains** and configure the DNS records shown by Vercel.
