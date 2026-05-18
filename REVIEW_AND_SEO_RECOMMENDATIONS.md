# Mountain Town Rehab Website: Refactor and SEO Recommendations

This document summarizes code cleanup, refactoring, and SEO improvements for the Mountain Town Rehab static website.

The site is currently a static Tailwind CSS website with separate HTML pages, shared visual patterns repeated inline, local images, PDFs, and a generated `dist/output.css` file.

## Executive Summary

The website is functional and builds successfully, but it can be made easier to maintain and stronger for local search.

The biggest code issue is not severe dead code. It is duplication: headers, footers, inline CSS, mobile menu scripts, logo SVGs, cards, and modals are repeated across multiple pages.

The biggest SEO opportunity is local relevance. Mountain Town Rehab should more clearly signal that it is a family-owned physical therapy clinic in Mt Pleasant / Mount Pleasant, MI serving Mid Michigan and Central Michigan.

## Priority 1: Quick Code Cleanup

### Remove Unused Image

`images/LSVT_Parkinson's.jpeg` appears to be unused.

The LSVT service currently references:

- `images/lsvt.jpg`

Recommended action:

- Delete `images/LSVT_Parkinson's.jpeg` if it is not needed for future content.

### Remove or Fix Dead Placeholder Links

The service cards in `services.html` use repeated `href="#"` links for "Learn more."

Because the whole service card opens a modal, these links are not true navigation links.

Recommended actions:

- Replace the `a href="#"` elements with `<button type="button">`.
- Or remove the inner link entirely and make the card itself the only clickable element.
- Add accessible labels if the card remains clickable.

### Remove Unused Tailwind Typography Plugin

The project includes `@tailwindcss/typography`, but no `prose` classes appear to be used.

Files involved:

- `package.json`
- `package-lock.json`
- `tailwind.config.js`

Recommended action:

- Remove `@tailwindcss/typography` unless article-style content pages are planned.
- Remove `require('@tailwindcss/typography')` from `tailwind.config.js`.

### Clean Up Stale Package Metadata

`package.json` currently includes:

```json
"main": "index.js"
```

There is no `index.js`, and this static site does not appear to need one.

Recommended action:

- Remove the `main` field from `package.json`.

### Expand `.gitignore`

Current `.gitignore` only ignores `node_modules/`.

Recommended additions:

```gitignore
node_modules/
.DS_Store
Thumbs.db
npm-debug.log*
```

## Priority 2: Reduce Repetition and Bloat

### Move Shared Inline CSS Into `src/input.css`

The following styles are repeated across many HTML pages:

- Animation keyframes
- `.animate-fade-in-up`
- `.animate-fade-in`
- Delay classes
- `.glass-card`
- `.gradient-text`
- `.card-hover`
- `.hero-gradient`
- `.accent-bar`
- `.nav-link`

Recommended action:

- Move shared styles from each page's `<style>` block into `src/input.css`.
- Keep page-specific styles only if truly unique.
- Rebuild Tailwind afterward with `npm run build`.

### Create a Shared JavaScript File

The mobile menu script is repeated across all pages.

Modal logic is repeated in:

- `services.html`
- `staff.html`

Recommended action:

- Create a shared JS file, for example `src/site.js` or `scripts/site.js`.
- Move mobile menu behavior into one reusable function.
- Move modal behavior into one reusable function that works with:
  - `[data-modal-target]`
  - `[data-modal-close]`
  - `.modal-backdrop`

Suggested behaviors to include:

- Toggle mobile menu.
- Update hamburger / close icon.
- Close modal on backdrop click.
- Close modal with Escape key.
- Restore focus to the triggering card or button.
- Set `aria-expanded` and `aria-hidden` where appropriate.

### Centralize Header and Footer

Every page repeats the same header, navigation, footer, and logo SVG.

Recommended approaches:

- Use a static site generator such as Eleventy or Astro.
- Or use a simple build script to inject shared partials.
- Or keep the site static but manually create shared snippets during a larger refactor.

Recommended shared components:

- Header
- Footer
- Desktop navigation
- Mobile navigation
- Logo
- CTA button

### Replace Repeated Logo SVG With a Shared Asset

The same inline SVG logo appears in each header and footer.

Recommended action:

- Create a reusable SVG file, such as `images/logo.svg`.
- Reference it with `<img>` or include it through a shared component.

This will reduce page size and avoid needing to edit the logo in many places.

### Convert Repeated Cards and Modals to Data-Driven Rendering

The most bloated files are:

- `services.html`
- `staff.html`

They contain repeated card and modal structures.

Recommended action:

- Store service and staff data in a structured source, such as JSON, front matter, or a JavaScript data object.
- Generate cards and modals from that data.

For services, each item could include:

- Title
- Slug
- Short summary
- Full modal content
- Image path
- Image alt text
- Animation delay

For staff, each item could include:

- Name
- Credentials / role
- Short card bio
- Full bio
- Image path
- Image alt text

### Improve Accessibility While Refactoring

Recommended improvements:

- Add `aria-label` to mobile menu buttons.
- Add `aria-expanded` to menu toggles.
- Add `aria-controls` pointing to the mobile menu.
- Add `role="dialog"` and `aria-modal="true"` to modals.
- Allow Escape key to close modals.
- Ensure clickable cards can be opened by keyboard.
- Prefer real buttons for actions that open modals.

## Priority 3: Local SEO Improvements

### Strengthen Page Titles

Current titles are clean but generic. Use local search terms more directly.

Recommended examples:

- Home: `Physical Therapy in Mt Pleasant, MI | Mountain Town Rehab`
- About: `Family-Owned Physical Therapy Clinic in Mt Pleasant, MI | Mountain Town Rehab`
- Services: `Physical Therapy Services in Mt Pleasant, MI | Mountain Town Rehab`
- Staff: `Meet Our Physical Therapists in Mt Pleasant, MI | Mountain Town Rehab`
- Patient Info: `New Patient Forms | Mountain Town Rehab Physical Therapy`
- Payments: `Online Payments | Mountain Town Rehab`
- Contact: `Contact Mountain Town Rehab | Physical Therapy in Mt Pleasant, MI`

### Rewrite Meta Descriptions

Meta descriptions should include location, services, and the family-owned differentiator.

Recommended homepage description:

```html
<meta name="description" content="Family-owned physical therapy clinic in Mt Pleasant, MI serving Central Michigan with one-on-one care, orthopedic rehab, sports rehab, pediatric therapy, aquatic therapy, dry needling, and post-surgical rehabilitation.">
```

Recommended services description:

```html
<meta name="description" content="Explore physical therapy services in Mt Pleasant, MI, including orthopedic rehab, sports rehab, post-surgical care, aquatic therapy, dry needling, pediatric therapy, vestibular therapy, and more.">
```

Recommended contact description:

```html
<meta name="description" content="Contact Mountain Town Rehab, a family-owned physical therapy clinic in Mt Pleasant, MI. Call, email, or visit us to schedule personalized care.">
```

### Use Both "Mt Pleasant" and "Mount Pleasant"

The website mostly uses `Mt Pleasant`.

Recommended action:

- Add `Mount Pleasant, MI` naturally in page copy.
- Continue using `Mt Pleasant, MI` too.
- Include `Central Michigan` and `Mid Michigan` where appropriate.

Example homepage copy:

> Mountain Town Rehab is a family-owned physical therapy clinic in Mt Pleasant, Michigan, serving patients throughout Mount Pleasant, Central Michigan, and Mid Michigan.

### Improve Homepage H1

Recommended homepage H1:

```html
<h1>Family-Owned Physical Therapy in Mt Pleasant, MI</h1>
```

Supporting copy can preserve the current warmth:

> Personalized, one-on-one care from a family-owned clinic dedicated to your trust and recovery.

### Add LocalBusiness / MedicalBusiness Structured Data

No JSON-LD structured data was found.

Recommended action:

- Add JSON-LD schema to the homepage.
- Consider using `MedicalBusiness`, `LocalBusiness`, or `Physiotherapy`.

Example starting point:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "Mountain Town Rehab",
  "url": "https://mountaintownrehab.com/",
  "telephone": "+1-989-779-2920",
  "email": "info@mountaintownrehab.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1106 W High St",
    "addressLocality": "Mt Pleasant",
    "addressRegion": "MI",
    "postalCode": "48858",
    "addressCountry": "US"
  },
  "areaServed": [
    "Mt Pleasant, MI",
    "Mount Pleasant, MI",
    "Central Michigan",
    "Mid Michigan"
  ],
  "medicalSpecialty": "Physical Therapy",
  "description": "Family-owned physical therapy clinic in Mt Pleasant, MI providing personalized rehabilitation and one-on-one care.",
  "priceRange": "$$"
}
</script>
```

Before publishing, confirm:

- Exact website URL
- Business hours
- Social profile URLs
- Whether to add accepted insurance or payment details

### Add Canonical Tags

Each page should have a canonical URL.

Example:

```html
<link rel="canonical" href="https://mountaintownrehab.com/services.html">
```

Recommended action:

- Add one canonical tag per page.
- Use the final production domain and preferred URL format.

### Add Open Graph Metadata

Recommended tags:

```html
<meta property="og:type" content="website">
<meta property="og:title" content="Physical Therapy in Mt Pleasant, MI | Mountain Town Rehab">
<meta property="og:description" content="Family-owned physical therapy clinic serving Mt Pleasant and Central Michigan with personalized, one-on-one care.">
<meta property="og:image" content="https://mountaintownrehab.com/images/hero-clinic.jpg">
<meta property="og:url" content="https://mountaintownrehab.com/">
```

Also consider:

```html
<meta name="twitter:card" content="summary_large_image">
```

### Add `robots.txt` and `sitemap.xml`

Recommended `robots.txt`:

```txt
User-agent: *
Allow: /

Sitemap: https://mountaintownrehab.com/sitemap.xml
```

Recommended sitemap entries:

- `/`
- `/about.html`
- `/services.html`
- `/staff.html`
- `/patient-info.html`
- `/payments.html`
- `/contact.html`

If service-specific pages are added later, include them too.

## Priority 4: Service Page SEO Expansion

The current `services.html` page is useful for users, but individual service pages would be stronger for search.

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

Each page should include:

- A local H1
- Who the service helps
- Conditions commonly treated
- What to expect at Mountain Town Rehab
- Why one-on-one care matters
- A call to schedule
- Internal links to related services
- LocalBusiness or Service schema if appropriate

Example H1:

```html
<h1>Dry Needling in Mt Pleasant, MI</h1>
```

Example intro:

> Mountain Town Rehab provides dry needling as part of personalized physical therapy care in Mt Pleasant, MI. Our therapists use one-on-one treatment plans to help address muscle pain, mobility limitations, and recovery goals.

## Priority 5: Content and Trust Signals

### Add Review and Testimonial Content

If patient permission is available, add testimonials to the homepage and relevant service pages.

Recommended format:

- Short quote
- First name and last initial, if allowed
- Service or condition type, if allowed

Do not publish patient health information without explicit permission.

### Highlight Local Trust Signals

The site already mentions several strong trust points. Make them more visible:

- Family-owned and operated
- Serving Central Michigan since 2001
- One-on-one care
- Independent clinic
- Advanced therapist credentials
- Locally rooted team
- Over two decades in the community

### Strengthen Staff Bios for Search and Trust

Staff bios are already detailed. Consider making each provider section easier for Google and users to scan:

- Name
- Credentials
- Specialty areas
- Education
- Certifications
- Local connection

This helps patients searching for specialized care and builds confidence.

### Improve FAQ SEO

The `patient-info.html` FAQ section is useful.

Recommended additions:

- Add FAQ schema.
- Add location-aware phrasing where natural.
- Add questions patients commonly search before booking.

Possible FAQ additions:

- Do you offer physical therapy in Mt Pleasant, MI?
- Do you treat sports injuries?
- Do you provide post-surgical rehabilitation?
- Do you offer dry needling?
- Do you treat children?
- What insurance plans do you accept?

## Priority 6: Image SEO and Performance

### Improve Alt Text

Current image alt text is generally present, but service images could be more descriptive and local.

Examples:

- Current: `Dry Needling`
- Better: `Dry needling physical therapy at Mountain Town Rehab in Mt Pleasant, MI`

- Current: `Aquatic Therapy`
- Better: `Aquatic therapy for rehabilitation in Mt Pleasant, MI`

### Add Width and Height Attributes

Where practical, add `width` and `height` attributes to images to reduce layout shift.

### Compress Large Images

Recommended action:

- Audit image file sizes.
- Compress large JPG / PNG files.
- Consider WebP versions for large hero and service images.

### Use Descriptive File Names Over Time

Future image names should include subject keywords.

Examples:

- `mt-pleasant-physical-therapy-clinic.jpg`
- `dry-needling-physical-therapy-mt-pleasant.jpg`
- `aquatic-therapy-mt-pleasant-mi.jpg`

## Priority 7: Google Business Profile Alignment

The site should match the Google Business Profile exactly.

Confirm consistency for:

- Business name
- Address
- Phone number
- Website URL
- Hours
- Services
- Business category
- Photos

Recommended actions:

- Add new clinic and team photos regularly.
- Add service descriptions to the Google Business Profile.
- Encourage happy patients to leave reviews.
- Respond to reviews professionally.
- Link the website from the profile.

## Suggested Implementation Order

1. Remove obvious dead code and stale metadata.
2. Move repeated inline CSS into `src/input.css`.
3. Add shared JavaScript for mobile menu and modals.
4. Update titles and meta descriptions.
5. Add canonical and Open Graph tags.
6. Add LocalBusiness / MedicalBusiness schema.
7. Add `robots.txt` and `sitemap.xml`.
8. Improve homepage copy and H1 for local SEO.
9. Improve service image alt text.
10. Create individual SEO-focused service pages.
11. Consider a static site generator if ongoing content updates are expected.

## Validation Checklist

After changes are made:

- Run `npm run build`.
- Confirm each page loads correctly.
- Test mobile navigation.
- Test service and staff modals.
- Validate structured data with Google's Rich Results Test.
- Check page titles and descriptions in browser dev tools.
- Submit sitemap in Google Search Console.
- Check that all internal links work.
- Check image paths and document download links.

