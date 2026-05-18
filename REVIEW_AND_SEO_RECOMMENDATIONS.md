# Mountain Town Rehab Website: Current Refactor and SEO Review

Updated after the latest efficiency and SEO pass.

This document reflects the current state of the Mountain Town Rehab static website and is intended as a handoff for a future IDE agent.

## Current State Summary

The website is in better shape than the first review.

Completed or improved:

- Shared visual CSS has been moved into `src/input.css`.
- Shared JavaScript now exists at `scripts/site.js`.
- Repeated inline mobile menu scripts have been removed.
- The stale `main: index.js` package metadata has been removed.
- `@tailwindcss/typography` has been removed from `package.json` and `tailwind.config.js`.
- The unused `images/LSVT_Parkinson's.jpeg` asset has been removed.
- Page titles and meta descriptions are now much more local-search focused.
- Open Graph and Twitter card tags have been added.
- Homepage LocalBusiness / MedicalBusiness JSON-LD has been added and parses as valid JSON.
- FAQ JSON-LD has been added to `patient-info.html` and parses as valid JSON.
- `robots.txt` and `sitemap.xml` now exist.
- Service image alt text has been improved with more descriptive local wording.
- `npm run build` passes.

Remaining work is now mostly about polishing SEO completeness, accessibility, lockfile cleanup, and reducing remaining HTML duplication.

## Priority 1: Fix Current Functional and Accessibility Gaps

### Add Canonical Tags

Canonical tags are still missing from all HTML pages.

Each page should include a canonical URL in the `<head>`.

Examples:

```html
<link rel="canonical" href="https://mountaintownrehab.com/">
<link rel="canonical" href="https://mountaintownrehab.com/services.html">
```

Recommended canonical targets:

- `index.html`: `https://mountaintownrehab.com/`
- `about.html`: `https://mountaintownrehab.com/about.html`
- `services.html`: `https://mountaintownrehab.com/services.html`
- `staff.html`: `https://mountaintownrehab.com/staff.html`
- `patient-info.html`: `https://mountaintownrehab.com/patient-info.html`
- `payments.html`: `https://mountaintownrehab.com/payments.html`
- `contact.html`: `https://mountaintownrehab.com/contact.html`

### Make Service and Staff Cards Keyboard Accessible

The service and staff cards currently open modals through clickable `<div>` elements with `data-target`.

Examples:

- `services.html`: service cards use `data-target`
- `staff.html`: staff cards use `data-target`
- `scripts/site.js`: click handlers are attached to `[data-target]`

Problem:

- Plain `<div>` elements are not naturally focusable.
- Keyboard users may not be able to open service or staff modals.
- Screen readers may not understand these as interactive controls.

Recommended fix:

- Convert clickable cards to `<button type="button">` elements, styled like cards.
- Or add `tabindex="0"`, `role="button"`, Enter/Space keyboard handling, and clear accessible labels.

Preferred approach:

```html
<button type="button" class="service-card ..." data-target="modal-ortho" aria-haspopup="dialog">
  ...
</button>
```

Then update `scripts/site.js` to support buttons cleanly.

### Replace Placeholder `href="#"` Links in Service Cards

The service cards still contain repeated `href="#"` links for "Learn more."

Problem:

- These are placeholder links, not true navigation.
- They rely on JavaScript `preventDefault()`.
- They are semantically wrong because they open modals rather than navigate.

Recommended actions:

- Replace the inner "Learn more" anchors with `<span>` if the whole card is the control.
- Or replace them with `<button type="button">` if only the "Learn more" text opens the modal.
- If future service pages are created, change these to real links.

Future-facing option:

```html
<a href="dry-needling-mt-pleasant-mi.html">Learn more</a>
```

### Improve Modal Accessibility

The modal behavior is better now because Escape closes open modals and focus is partially restored, but modal markup still needs accessibility work.

Recommended improvements:

- Add `role="dialog"` to modal containers.
- Add `aria-modal="true"`.
- Add `aria-hidden="true"` by default and update it when opened.
- Add `aria-labelledby` pointing to the modal heading.
- Add accessible labels to close buttons, such as `aria-label="Close Orthopedic Rehab dialog"`.
- Move focus into the modal when it opens.
- Trap focus inside the modal while it is open.
- Restore focus to the trigger when the modal closes.

Example:

```html
<div id="modal-ortho"
     class="fixed inset-0 z-[100] hidden flex items-center justify-center"
     role="dialog"
     aria-modal="true"
     aria-hidden="true"
     aria-labelledby="modal-ortho-title">
  ...
  <button type="button" class="modal-close" aria-label="Close Orthopedic Rehab dialog" data-target="modal-ortho">
    ...
  </button>
  <h3 id="modal-ortho-title">Orthopedic Rehab</h3>
</div>
```

### Guard the PayPal Embed

The PayPal page loads the PayPal SDK and immediately calls:

```js
paypal.HostedButtons(...).render(...)
```

Problem:

- If the PayPal script is blocked, delayed, or fails to load, this can throw a JavaScript error.

Recommended fix:

```html
<script>
  if (window.paypal && typeof window.paypal.HostedButtons === 'function') {
    paypal.HostedButtons({
      hostedButtonId: "3XJ2GD5AT26D6",
    }).render("#paypal-container-3XJ2GD5AT26D6");
  } else {
    document.getElementById("paypal-container-3XJ2GD5AT26D6").innerHTML =
      '<p class="text-sm text-slate-400">Online payment is temporarily unavailable. Please call (989) 779-2920.</p>';
  }
</script>
```

## Priority 2: Clean Up Package and Build State

### Sync `package-lock.json`

`@tailwindcss/typography` has been removed from `package.json`, but it is still present in `package-lock.json`.

`npm ls --depth=0` reports it as extraneous.

Recommended action:

- Run a clean package update so the lockfile matches `package.json`.

Suggested command:

```bash
npm install
```

Then verify:

```bash
npm ls --depth=0
npm run build
```

Expected result:

- Only `tailwindcss` should appear as the top-level dependency.
- No extraneous typography package should remain.

### Update Tailwind Content Paths

`tailwind.config.js` currently scans:

```js
content: [
  "./*.html",
  "./src/**/*.js"
]
```

The shared JavaScript file now lives in `scripts/site.js`, not under `src`.

Recommended action:

```js
content: [
  "./*.html",
  "./scripts/**/*.js"
]
```

Or include both if future source scripts may live in `src`:

```js
content: [
  "./*.html",
  "./src/**/*.js",
  "./scripts/**/*.js"
]
```

This is low risk right now because the current JS file does not appear to contain Tailwind class strings that need scanning, but the config should match the project structure.

## Priority 3: Finish SEO Completeness

### Confirm Production Domain

The sitemap, robots file, Open Graph URLs, and structured data use:

```txt
https://mountaintownrehab.com/
```

Recommended action:

- Confirm this is the final preferred production domain.
- Confirm whether `www.mountaintownrehab.com` redirects to the non-www version, or vice versa.
- Make canonical tags match the preferred domain exactly.

### Confirm Business Hours in Structured Data

Homepage JSON-LD includes business hours.

Recommended action:

- Confirm the hours are correct before publishing.
- If hours vary by holiday or appointment type, consider keeping schema general and ensuring Google Business Profile is accurate.

### Expand Structured Data Over Time

Current structured data improvements:

- Homepage has valid MedicalBusiness / LocalBusiness style JSON-LD.
- Patient info page has valid FAQ JSON-LD.

Possible future additions:

- Add `sameAs` links for official social profiles.
- Add `geo` coordinates if known.
- Add `hasMap` with the Google Maps URL.
- Add `makesOffer` or `Service` data for major physical therapy services.

Do not overdo structured data. Keep it accurate and only include information visible or clearly supported by the site.

### Keep Page Titles and Meta Descriptions

The title and description updates are a good improvement and should stay.

Current direction is strong:

- Home targets physical therapy in Mt Pleasant, MI.
- About emphasizes family-owned care.
- Services targets local physical therapy services.
- Staff targets physical therapists in Mt Pleasant.
- Contact targets local scheduling intent.

Recommended future refinement:

- Make Open Graph descriptions slightly more distinct per page.
- Keep titles under roughly 60 characters where practical.
- Keep descriptions concise and human-readable.

## Priority 4: Continue Reducing HTML Duplication

### Centralize Header and Footer

Headers and footers are still repeated across every page.

Recommended approaches:

- Use a static site generator such as Eleventy or Astro.
- Or use a simple build script to inject shared partials.
- Or manually maintain shared partial snippets if staying fully static.

Shared components to extract:

- Header
- Footer
- Desktop navigation
- Mobile navigation
- Logo SVG
- CTA button

### Replace Repeated Inline Logo SVG

The same logo SVG still appears in multiple headers and footers.

Recommended action:

- Create `images/logo.svg`.
- Reference it with `<img src="images/logo.svg" alt="Mountain Town Rehab">`.

This reduces page size and makes future logo updates simpler.

### Make Services and Staff More Data-Driven

The largest remaining pages are still:

- `services.html`
- `staff.html`

Recommended future refactor:

- Store service and staff content in structured data.
- Generate cards and modals from that data.

Possible service fields:

- Title
- Slug
- Short summary
- Full description
- Image path
- Image alt text
- Modal ID

Possible staff fields:

- Name
- Credentials
- Role
- Short bio
- Full bio
- Image path
- Image alt text
- Specialty areas

This is optional if the site will remain small, but it will help if the clinic expects ongoing content updates.

## Priority 5: Service Page SEO Expansion

The current `services.html` page is useful, but individual service pages would likely perform better for local search.

Recommended future pages:

- `orthopedic-physical-therapy-mt-pleasant-mi.html`
- `sports-rehab-mt-pleasant-mi.html`
- `post-surgical-rehab-mt-pleasant-mi.html`
- `dry-needling-mt-pleasant-mi.html`
- `aquatic-therapy-mt-pleasant-mi.html`
- `pediatric-physical-therapy-mt-pleasant-mi.html`
- `vestibular-therapy-mt-pleasant-mi.html`
- `lymphedema-therapy-mt-pleasant-mi.html`
- `parkinsons-lsvt-therapy-mt-pleasant-mi.html`

Each service page should include:

- A local H1.
- Who the service helps.
- Conditions commonly treated.
- What to expect at Mountain Town Rehab.
- Why one-on-one care matters.
- A call to schedule.
- Internal links to related services.
- Local service schema if appropriate.

Example H1:

```html
<h1>Dry Needling in Mt Pleasant, MI</h1>
```

Example intro:

> Mountain Town Rehab provides dry needling as part of personalized physical therapy care in Mt Pleasant, MI. Our therapists use one-on-one treatment plans to help address muscle pain, mobility limitations, and recovery goals.

## Priority 6: Content and Trust Signals

### Add Reviews or Testimonials

If patient permission is available, add testimonials to the homepage and relevant service pages.

Recommended format:

- Short quote.
- First name and last initial, if allowed.
- Service or condition type, if allowed.

Do not publish patient health information without explicit permission.

### Keep Local Trust Signals Visible

The site now does a better job with local identity. Continue highlighting:

- Family-owned and operated.
- Serving Central Michigan since 2001.
- One-on-one care.
- Independent clinic.
- Advanced therapist credentials.
- Locally rooted team.
- Over two decades in the community.

### Strengthen Staff Bios for Search and Trust

Staff bios are detailed, but future improvements could make them easier to scan.

Suggested structure:

- Name
- Credentials
- Specialty areas
- Education
- Certifications
- Local connection

This helps patients looking for specialized expertise and supports local trust.

## Priority 7: Image SEO and Performance

### Add Width and Height Attributes

Service image alt text has improved, but images still generally do not include explicit `width` and `height` attributes.

Recommended action:

- Add width and height attributes where practical.
- This can reduce layout shift and improve page experience.

### Compress Large Images

Recommended action:

- Audit image file sizes.
- Compress large JPG and PNG files.
- Consider WebP versions for large hero and service images.

### Use Descriptive File Names Over Time

Future image names should include subject keywords.

Examples:

- `mt-pleasant-physical-therapy-clinic.jpg`
- `dry-needling-physical-therapy-mt-pleasant.jpg`
- `aquatic-therapy-mt-pleasant-mi.jpg`

## Priority 8: Google Business Profile Alignment

The website should match the Google Business Profile exactly.

Confirm consistency for:

- Business name.
- Address.
- Phone number.
- Website URL.
- Hours.
- Services.
- Business category.
- Photos.

Recommended actions:

- Add new clinic and team photos regularly.
- Add service descriptions to the Google Business Profile.
- Encourage happy patients to leave reviews.
- Respond to reviews professionally.
- Link the website from the profile.

## Suggested Implementation Order From Here

1. Add canonical tags to every page.
2. Replace service `href="#"` controls with semantic buttons or real service links.
3. Make service and staff cards keyboard accessible.
4. Add dialog semantics and focus management to modals.
5. Guard the PayPal embed with a fallback.
6. Run `npm install` to sync `package-lock.json`.
7. Update Tailwind content paths to include `scripts/**/*.js`.
8. Confirm production domain and business hours.
9. Consider extracting header/footer/logo into shared components.
10. Create individual service pages for stronger local SEO.

## Validation Checklist

After future changes:

- Run `npm run build`.
- Run `npm ls --depth=0` and confirm no extraneous packages.
- Confirm each page loads correctly.
- Test mobile navigation.
- Test service and staff modals with mouse and keyboard.
- Test Escape key closes modals.
- Confirm focus moves into modals and returns after close.
- Validate JSON-LD with Google's Rich Results Test.
- Check page titles, descriptions, canonical tags, and Open Graph tags.
- Submit or resubmit `sitemap.xml` in Google Search Console.
- Check that all internal links work.
- Check image paths and document download links.

