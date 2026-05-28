# Mountain Town Rehab — Website Review (May 2026)

> [!NOTE]
> This is a fresh, comprehensive audit against the **latest codebase** (commit `4b82427`). Items from prior reviews that have been addressed are listed in the "Already Done" section and removed from action items.

---

## Phase 1-3 Implementation Update

The first three improvement phases have now been applied in the working tree:

- **Build output refreshed** — `dist/output.css` has been rebuilt from the current Tailwind config and includes `sage-950` gradient utilities.
- **Global navigation accessibility improved** — skip links, desktop navigation labels, mobile navigation labels, active-page `aria-current`, mobile button labels, and visible keyboard focus rings have been added.
- **Staff cards and modals improved** — staff cards are real buttons, staff bio modals have dialog semantics, labelled titles, close-button labels, Escape support, focus restoration, and focus trapping.
- **Careers form safety improved** — resume-link errors are announced to assistive tech, the success modal has dialog semantics and focus handling, and API/network failures now clearly say the application was not submitted.

Remaining major open areas are mostly Phase 4+ work: richer service-page content, service FAQs/schema, breadcrumbs/related links, staff schema, and maintainability cleanup.

---

## What's Already Been Done ✅

The following items from prior reviews have been **verified as complete**:

- ✅ **Canonical tags** — present on all pages with correct absolute URLs
- ✅ **`<h1>` tags** — present on all pages (homepage, about, services, staff, careers, patient-info, contact, payments, all 11 service detail pages)
- ✅ **`MedicalBusiness` JSON-LD** — on homepage and replicated across all pages
- ✅ **`MedicalProcedure` JSON-LD** — on all 11 individual service detail pages
- ✅ **`FAQPage` JSON-LD** — on patient-info.html, matches all 8 visible FAQ items
- ✅ **PayPal guard/fallback** — robust with try/catch, onerror handler, `aria-live="polite"`, and phone fallback
- ✅ **Open Graph + Twitter Card** meta tags — on all pages
- ✅ **Meta descriptions** — unique per page, locally-focused, good lengths
- ✅ **Google Maps iframe** — has `loading="lazy"` and `title` attribute
- ✅ **Careers form** — connected to Web3Forms API backend with honeypot, validation, loading states
- ✅ **Semantic HTML** — `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>` on all pages
- ✅ **Native `<details>`/`<summary>`** — for FAQ accordion (no JS dependency)
- ✅ **`robots.txt`** and **`sitemap.xml`** — exist and properly configured
- ✅ **`aria-hidden` toggling** — on modals in site.js
- ✅ **`aria-expanded` toggling** — on mobile menu in site.js
- ✅ **Focus restoration** — `lastTrigger.focus()` when modal closes
- ✅ **Null checks** — in site.js (`if (menuBtn && mobileMenu)`)
- ✅ **LSVT BIG** branding standardized
- ✅ **Image alt text** — descriptive and location-rich on all pages
- ✅ **Service cards** — now use `<a>` tags with real URLs to service pages (no more `href="#"`)
- ✅ **Escape key** — closes open modals
- ✅ **Script loading** — `site.js` loaded with `defer` on all pages

---

## Executive Summary

The site has a strong SEO and structural foundation. The remaining work falls into three categories:

1. **Broken CSS + Content** — `sage-950` gradient is broken on 8 pages; service detail pages are critically thin (~55 words each)
2. **Accessibility** — staff/job cards not keyboard-accessible, modals lack ARIA dialog semantics, no skip links, focus rings removed
3. **Performance** — 9 MB+ in oversized images, 43 KB unminified CSS, no lazy loading

---

## Priority 0 — Broken CSS (Fix Immediately)

### 0.1 `sage-950` Color Is Missing from Tailwind Config

The announcement bar on **8 pages** (index, about, services, staff, careers, patient-info, contact, payments) uses `from-sage-950 via-sage-900 to-sage-950` in its gradient classes. However, [tailwind.config.js](file:///c:/Users/stans/MTRWebsite/tailwind.config.js) only defines `sage` shades `50` through `900` — **`sage-950` is not defined**.

**Confirmed:** `sage-950` does **not appear** in [dist/output.css](file:///c:/Users/stans/MTRWebsite/dist/output.css). The `from-sage-950` and `to-sage-950` classes generate no CSS, so the gradient endpoints are transparent/missing.

**Fix** — add `950` to the sage color scale in `tailwind.config.js` (line 20):

```diff
  sage: {
    // ... existing shades 50-900 ...
    900: '#2a3a33',
+   950: '#1a2b22',
  },
```

Then rebuild: `npm run build`

---

## Priority 1 — SEO Content & Structure

### 1.1 Extremely Thin Content on Service Detail Pages

> [!WARNING]
> This is the most impactful remaining SEO issue. The 11 individual service pages average only **~55 words of body text** each (1 paragraph, no H2 sub-sections). Google considers pages under 300 words as "thin content," which can trigger Helpful Content ranking penalties.

| Page | Paragraphs | Approx. Words |
|------|:----------:|:-------------:|
| [service-aquatic-therapy.html](file:///c:/Users/stans/MTRWebsite/service-aquatic-therapy.html) | 1 | ~55 |
| [service-blood-flow-restriction.html](file:///c:/Users/stans/MTRWebsite/service-blood-flow-restriction.html) | 1 | ~66 |
| [service-dry-needling.html](file:///c:/Users/stans/MTRWebsite/service-dry-needling.html) | 1 | ~49 |
| [service-lsvt-big.html](file:///c:/Users/stans/MTRWebsite/service-lsvt-big.html) | 2 | ~133 |
| [service-lymphedema.html](file:///c:/Users/stans/MTRWebsite/service-lymphedema.html) | 1 | ~55 |
| [service-neurologic-rehab.html](file:///c:/Users/stans/MTRWebsite/service-neurologic-rehab.html) | 1 | ~50 |
| [service-orthopedic-rehab.html](file:///c:/Users/stans/MTRWebsite/service-orthopedic-rehab.html) | 1 | ~58 |
| [service-pediatric-rehab.html](file:///c:/Users/stans/MTRWebsite/service-pediatric-rehab.html) | 1 | ~63 |
| [service-post-surgical-care.html](file:///c:/Users/stans/MTRWebsite/service-post-surgical-care.html) | 1 | ~55 |
| [service-sports-rehab.html](file:///c:/Users/stans/MTRWebsite/service-sports-rehab.html) | 1 | ~54 |
| [service-vestibular-therapy.html](file:///c:/Users/stans/MTRWebsite/service-vestibular-therapy.html) | 1 | ~52 |

**Each service page should have 400-800+ words with H2 sub-sections:**
- **What is [service]?** (H2) — explanation for patients
- **Who benefits / conditions treated?** (H2) — list of conditions
- **What to expect during treatment** (H2) — session description
- **Why choose Mountain Town Rehab?** (H2) — differentiators (one-on-one care, family-owned)
- **FAQ section** (H2) — 3-5 common questions with `FAQPage` schema

### 1.2 Fix Heading Hierarchy Gaps

Several pages jump from `<h1>` directly to `<h3>` with no `<h2>`:

| Page | Issue | Fix |
|------|-------|-----|
| [services.html](file:///c:/Users/stans/MTRWebsite/services.html) | H1 → H3 (card titles), no H2 | Add `<h2>` before service card grid |
| [staff.html](file:///c:/Users/stans/MTRWebsite/staff.html) | H1 → H3 (staff names), no H2 | Add `<h2>Our Team</h2>` before staff grid |
| [contact.html](file:///c:/Users/stans/MTRWebsite/contact.html) | H1 → H3 (info sections), no H2 | Add `<h2>Get In Touch</h2>` |
| [payments.html](file:///c:/Users/stans/MTRWebsite/payments.html) | H1 → H3 ("Pay with PayPal"), no H2 | Add `<h2>Payment Options</h2>` |
| All 11 service detail pages | H1 only, zero H2s | Add H2 sub-sections (see 1.1) |

### 1.3 Update Sitemap

[sitemap.xml](file:///c:/Users/stans/MTRWebsite/sitemap.xml) has two issues:
- **`careers.html` is missing** from the sitemap entirely, despite being linked from every page
- `<lastmod>` dates should be updated when pages are modified (core pages show `2026-05-17`, service pages show `2026-05-25`)

### 1.4 Add `Person`/`Physician` Schema to Staff Page

[staff.html](file:///c:/Users/stans/MTRWebsite/staff.html) has detailed bios for 8 staff members but no `Person` structured data. This is a significant E-E-A-T opportunity for a medical site:

```json
{
  "@context": "https://schema.org",
  "@type": "Physician",
  "name": "Mark Stansberry",
  "jobTitle": "Physical Therapist, DPT",
  "worksFor": { "@type": "MedicalBusiness", "name": "Mountain Town Rehab" },
  "image": "https://mountaintownrehab.com/images/mark-stansberry-physical-therapist-mt-pleasant-mi.jpg"
}
```

### 1.5 Add `JobPosting` Schema to Careers Page

[careers.html](file:///c:/Users/stans/MTRWebsite/careers.html) lists PT and PTA positions but has no `JobPosting` structured data. Google can surface these directly in job search results:

```json
{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Physical Therapist",
  "datePosted": "2026-05-01",
  "hiringOrganization": { "@type": "MedicalBusiness", "name": "Mountain Town Rehab" },
  "jobLocation": {
    "@type": "Place",
    "address": { "@type": "PostalAddress", "addressLocality": "Mt Pleasant", "addressRegion": "MI" }
  },
  "employmentType": "FULL_TIME"
}
```

---

## Priority 2 — Accessibility

### 2.1 Make Staff Cards Keyboard Accessible

Staff cards in [staff.html](file:///c:/Users/stans/MTRWebsite/staff.html) are `<div>` elements with `cursor-pointer` and `data-target`. They are not focusable by keyboard, have no `role`, and no `tabindex`.

**Fix** — convert to `<button>` elements:
```html
<button type="button" class="staff-card" data-target="modal-mark" aria-haspopup="dialog">
  ...
</button>
```

> [!NOTE]
> Service cards in [services.html](file:///c:/Users/stans/MTRWebsite/services.html) are now `<a>` tags with real URLs — these are already keyboard accessible ✅. Only the **staff cards** and **careers job detail toggles** still need this fix.

### 2.2 Add ARIA Dialog Semantics to Modals

Staff modals in [staff.html](file:///c:/Users/stans/MTRWebsite/staff.html) are missing dialog attributes. While `aria-hidden` toggling is handled in JS ✅, the HTML needs:

```html
<div id="modal-mark" role="dialog" aria-modal="true" aria-labelledby="modal-mark-title">
  <button type="button" class="modal-close" aria-label="Close dialog">×</button>
  <h3 id="modal-mark-title">Mark Stansberry</h3>
  ...
</div>
```

The careers success modal (L430 in [careers.html](file:///c:/Users/stans/MTRWebsite/careers.html)) already has `role="dialog"` and close button `aria-label` ✅, but is missing `aria-modal="true"` and `aria-labelledby`.

### 2.3 Add Focus Trapping to Modals

[site.js](file:///c:/Users/stans/MTRWebsite/scripts/site.js) restores focus on close ✅ but does **not trap focus** inside the modal. Tab can navigate to elements behind the modal overlay.

### 2.4 Fix `focus:outline-none` on Mobile Menu Button

The mobile menu button uses `focus:outline-none` on **every page**, removing the keyboard focus ring. This is a WCAG 2.1 violation.

```diff
- focus:outline-none
+ focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2
```

> [!NOTE]
> In [careers.html](file:///c:/Users/stans/MTRWebsite/careers.html), form inputs also use `focus:outline-none` but pair it with `focus:border-sage-500 focus:ring-1` — this is acceptable since the custom ring replaces the outline.

### 2.5 Add Skip Navigation Links

No page has a skip link. Add to every page:

```html
<a href="#primary" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:shadow-lg">
  Skip to content
</a>
```

### 2.6 Add `aria-label` to Mobile Menu Button in HTML

The button's `aria-label` is set only via JavaScript (site.js L29). If JS fails, the button has no accessible name. Add directly in HTML:

```html
<button id="mobile-menu-btn" aria-label="Toggle navigation menu" ...>
```

### 2.7 Add `aria-label` to `<nav>` Elements

The `<nav>` elements (desktop and mobile) lack `aria-label="Main navigation"`.

### 2.8 Add `aria-current="page"` to Active Nav Links

Active nav links use a CSS `active` class but no `aria-current="page"` for screen readers.

### 2.9 Add `rel="noopener"` to `target="_blank"` Links

Affected files:
- [patient-info.html](file:///c:/Users/stans/MTRWebsite/patient-info.html) — 3 PDF download links (L248, L261, L274)
- [careers.html](file:///c:/Users/stans/MTRWebsite/careers.html) — resume sharing link in success modal (L464)

### 2.10 Form Error Accessibility

In [careers.html](file:///c:/Users/stans/MTRWebsite/careers.html), the `link-error` div (L406) lacks `role="alert"` or `aria-live="assertive"` — screen readers won't announce form errors.

---

## Priority 3 — Performance & Image Optimization

### 3.1 Compress Large Images

> [!CAUTION]
> Seven images exceed 500 KB. The top two alone account for **7.7 MB**. This causes severe load times especially on mobile.

| Image | Current Size | Target Size |
|-------|-------------|-------------|
| [Front_Desk.jpg](file:///c:/Users/stans/MTRWebsite/images/Front_Desk.jpg) | **4.5 MB** | ~100-200 KB |
| [Mountains.jpg](file:///c:/Users/stans/MTRWebsite/images/Mountains.jpg) | **3.2 MB** | ~100-200 KB |
| [Hats.jpg](file:///c:/Users/stans/MTRWebsite/images/Hats.jpg) | **1.2 MB** | ~80-150 KB |
| [wall-art.jpg](file:///c:/Users/stans/MTRWebsite/images/wall-art.jpg) | **884 KB** | ~100-150 KB |
| [hero-clinic.jpg](file:///c:/Users/stans/MTRWebsite/images/hero-clinic.jpg) | **715 KB** | ~100-200 KB |
| [MTR_sign.jpg](file:///c:/Users/stans/MTRWebsite/images/MTR_sign.jpg) | **604 KB** | ~80-120 KB |
| [Hippie_Halloween.jpg](file:///c:/Users/stans/MTRWebsite/images/Hippie_Halloween.jpg) | **583 KB** | ~80-120 KB |
| [Favicon.png](file:///c:/Users/stans/MTRWebsite/images/Favicon.png) | **333 KB** | ~5-10 KB |

**Recommendations:**
- Resize to actual display dimensions (max ~1200px wide)
- Compress to 80% JPEG quality
- Consider WebP with `<picture>` fallback
- Generate proper favicon sizes (16×16, 32×32, 180×180) — the current 333 KB favicon is ~30x larger than it should be

### 3.2 Add `loading="lazy"` to Below-the-Fold Images

No `<img>` tags use `loading="lazy"`. Staff page alone has **16 `<img>` tags** (8 cards + 8 modals) all loaded eagerly.

### 3.3 Add `width` and `height` Attributes to Images

No images have explicit dimensions, causing Cumulative Layout Shift (CLS).

### 3.4 Minify Production CSS

[output.css](file:///c:/Users/stans/MTRWebsite/dist/output.css) is **43 KB / 2,520 lines, unminified**. Add `--minify` to the build script in [package.json](file:///c:/Users/stans/MTRWebsite/package.json):

```diff
- "build": "tailwindcss -i ./src/input.css -o ./dist/output.css",
+ "build": "tailwindcss -i ./src/input.css -o ./dist/output.css --minify",
```

### 3.5 Convert Hero Images from CSS Backgrounds to `<img>` Tags

Hero sections on homepage, about, contact, careers, patient-info, and payments use CSS `background-image` via inline `style`. This means:
- Search engines can't crawl/index these images
- No `loading` or `fetchpriority` control
- No `<picture>` element for responsive sizes or WebP

### 3.6 Throttle the Scroll Event Listener

In [site.js](file:///c:/Users/stans/MTRWebsite/scripts/site.js), the back-to-top button scroll listener fires on every scroll event. Use `requestAnimationFrame`:

```javascript
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      backToTop.classList.toggle("hidden", window.scrollY <= 300);
      ticking = false;
    });
    ticking = true;
  }
});
```

### 3.7 Use Event Delegation in JavaScript

`querySelectorAll('[data-target]').forEach(...)` attaches individual listeners. Use a single delegated listener on `document.body` instead.

---

## Priority 4 — Build & Configuration

### 4.1 Fix Tailwind Content Paths

[tailwind.config.js](file:///c:/Users/stans/MTRWebsite/tailwind.config.js) scans `./src/**/*.js` but the JS file is at `./scripts/site.js`:

```diff
  content: [
    "./*.html",
-   "./src/**/*.js"
+   "./src/**/*.js",
+   "./scripts/**/*.js"
  ],
```

### 4.2 Connect Contact Form Backend

The [contact.html](file:///c:/Users/stans/MTRWebsite/contact.html) form has **no backend** — no `action` attribute and no JS submission handler. The careers form uses Web3Forms successfully; consider the same approach.

### 4.3 Inconsistent Announcement Bar

The "We are Hiring!" announcement bar appears on 8 pages (index, about, services, staff, careers, patient-info, contact, payments) but is **missing from all 11 service detail pages**. Either add it to all pages or ensure the inconsistency is intentional.

### 4.4 Rename Animation Delay Classes

In [input.css](file:///c:/Users/stans/MTRWebsite/src/input.css), `.delay-100` through `.delay-800` use `animation-delay`, which shadows Tailwind's built-in `delay-*` utilities (which target `transition-delay`). Rename to `.anim-delay-100` etc.

### 4.5 Move Inline `<style>` Block to CSS

[payments.html](file:///c:/Users/stans/MTRWebsite/payments.html) has an inline `<style>` block (L63-69) for PayPal overrides. Move to [input.css](file:///c:/Users/stans/MTRWebsite/src/input.css).

---

## Priority 5 — Design & UX Enhancements

### 5.1 Add Breadcrumb Navigation to Service Pages

All 11 service detail pages are isolated — no breadcrumb trail and no cross-links to related services:

```html
<nav aria-label="Breadcrumb">
  <ol class="flex gap-2 text-sm text-slate-400">
    <li><a href="index.html">Home</a></li>
    <li>/</li>
    <li><a href="services.html">Services</a></li>
    <li>/</li>
    <li aria-current="page">Dry Needling</li>
  </ol>
</nav>
```

### 5.2 Add "Related Services" Cross-Links

Each service page should link to 2-3 related services to improve internal linking and reduce bounce rate.

### 5.3 Add FAQ Sections to Service Pages

Use the same `<details>`/`<summary>` pattern from [patient-info.html](file:///c:/Users/stans/MTRWebsite/patient-info.html), with `FAQPage` schema.

### 5.4 Consider `noindex` for Payments Page

[payments.html](file:///c:/Users/stans/MTRWebsite/payments.html) has minimal content beyond the PayPal button. Payment pages generally shouldn't appear in search results.

### 5.5 Shorten Homepage Meta Description

The homepage meta description is ~217 characters — search engines typically truncate at ~160.

### 5.6 Make OG Descriptions Distinct from Meta Descriptions

On all 11 service detail pages, `og:description` is identical to `meta description`. Social platforms truncate at ~155 chars — consider shorter, punchier OG descriptions (like [services.html](file:///c:/Users/stans/MTRWebsite/services.html) already does well).

---

## Priority 6 — Efficiency & Maintainability

### 6.1 Extract Shared Header, Footer, and Logo SVG

The same header (~85 lines), footer (~75 lines), and inline logo SVG are duplicated across all pages. The 11 service detail pages are **~93% duplicated code** — only ~12 lines are unique per page out of ~193 total (~2,000 lines of duplicated boilerplate).

**Options (least to most effort):**
1. Extract the logo SVG to `images/logo.svg` and reference via `<img>` (quick win)
2. Use a simple build script to inject shared HTML partials
3. Adopt a lightweight static site generator (Eleventy, Astro) — **recommended** given the scale

### 6.2 Fix PDF Filenames

[patient-info.html](file:///c:/Users/stans/MTRWebsite/patient-info.html) links to PDFs with spaces in filenames (`Patient Information Form.pdf`, `Pediatric Patient Information Form.pdf`). Use hyphens for better compatibility.

### 6.3 Consider Self-Hosting Google Fonts

Three Google Fonts (Outfit, Inter, Playfair Display) are loaded from Google's CDN. Self-hosting improves privacy and eliminates external DNS lookups.

---

## Priority 7 — Content & Trust Signals

### 7.1 Add Patient Testimonials

If patient permission is available, add brief testimonials to the homepage and relevant service pages.

### 7.2 Use Descriptive Image Filenames

Future images should use keyword-rich names (`mt-pleasant-physical-therapy-clinic.jpg` instead of `gym.jpg`).

### 7.3 Align with Google Business Profile

Ensure NAP (name, address, phone) consistency between website and Google Business Profile.

---

## Summary Checklist

| # | Item | Priority | Impact |
|---|------|----------|--------|
| 0 | **Fix `sage-950` missing color** (broken gradient on 8 pages) | **P0** | 🔴 **Critical** |
| 1 | **Expand thin service page content** (55 words → 400+) | P1 | 🔴 **High** |
| 2 | Fix heading hierarchy gaps (H1→H3 jumps on 4+ pages) | P1 | 🔴 High |
| 3 | Add `careers.html` to sitemap | P1 | 🟡 Medium |
| 4 | Add `Person`/`Physician` schema to staff page | P1 | 🟡 Medium |
| 5 | Add `JobPosting` schema to careers page | P1 | 🟡 Medium |
| 6 | Make staff cards keyboard accessible (divs → buttons) | P2 | 🔴 High |
| 7 | Add `role="dialog"` + `aria-modal` + `aria-labelledby` to modals | P2 | 🔴 High |
| 8 | Fix `focus:outline-none` on mobile menu → `focus-visible:ring` | P2 | 🔴 High |
| 9 | Add focus trapping inside modals | P2 | 🟡 Medium |
| 10 | Add skip navigation links | P2 | 🟡 Medium |
| 11 | Add `aria-label` to mobile menu button in HTML | P2 | 🟡 Medium |
| 12 | Add `aria-label` to `<nav>` elements | P2 | 🟢 Low |
| 13 | Add `aria-current="page"` to active nav | P2 | 🟢 Low |
| 14 | Add `rel="noopener"` to `target="_blank"` links | P2 | 🟢 Low |
| 15 | Form error `role="alert"` on careers error display | P2 | 🟢 Low |
| 16 | **Compress large images** (save ~9 MB total) | P3 | 🔴 **High** |
| 17 | **Reduce favicon** from 333 KB to ~5-10 KB | P3 | 🟡 Medium |
| 18 | Add `loading="lazy"` to below-fold images | P3 | 🟡 Medium |
| 19 | Add `width`/`height` to images | P3 | 🟡 Medium |
| 20 | Minify CSS (`--minify` flag in build) | P3 | 🟡 Medium |
| 21 | Convert hero CSS backgrounds to `<img>` tags | P3 | 🟡 Medium |
| 22 | Throttle scroll listener (rAF) | P3 | 🟢 Low |
| 23 | Use event delegation in site.js | P3 | 🟢 Low |
| 24 | Fix Tailwind content paths (add `scripts/`) | P4 | 🟡 Medium |
| 25 | Connect contact form backend | P4 | 🟡 Medium |
| 26 | Add announcement bar to service detail pages (or decide not to) | P4 | 🟢 Low |
| 27 | Rename `.delay-*` animation classes | P4 | 🟢 Low |
| 28 | Move payments inline `<style>` to input.css | P4 | 🟢 Low |
| 29 | Add breadcrumb navigation to service pages | P5 | 🟡 Medium |
| 30 | Add "Related Services" cross-links | P5 | 🟡 Medium |
| 31 | Add FAQ sections + schema to service pages | P5 | 🟡 Medium |
| 32 | Consider `noindex` on payments page | P5 | 🟢 Low |
| 33 | **Extract shared header/footer/logo** (~93% duplication) | P6 | 🟡 Medium |
| 34 | Fix PDF filenames (remove spaces) | P6 | 🟢 Low |
| 35 | Add patient testimonials | P7 | 🟡 Medium |
| 36 | Use descriptive image filenames | P7 | 🟢 Low |
