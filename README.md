# BuiltPoint Construction & Development — Website

A modern, static marketing site for BuiltPoint Construction & Development. Plain HTML, CSS, and JavaScript with no build step, so it can be hosted anywhere (Vercel, Netlify, GitHub Pages, or any web server).

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: hero, services overview, featured projects, why BuiltPoint, process, testimonials, CTA |
| `about.html` | Story, values, credentials |
| `services.html` | Six service lines with deep links (`#ground-up`, `#renovation`, `#development`, `#preconstruction`, `#design-build`, `#cm`) |
| `projects.html` | Filterable project grid |
| `team.html` | Leadership profiles and team grid with click-to-open bios |
| `contact.html` | Contact form and office details |

## Run locally

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Replace the placeholder content

Everything below is placeholder copy and should be swapped for real information before launch.

- **Address, phone, email** appear in the header menu, footer, and `contact.html`. Search for `123 Builder Street`, `312 555 0148`, and `hello@builtpoint.com`.
- **Team members** live in `team.html`. Each `.member` button carries `data-name`, `data-role`, and `data-bio`, which feed the bio modal. Drop headshots into `assets/team/` and point each `<img>` at the file. Square images (at least 800×800) work best.
- **Projects** live in `projects.html` and the featured block in `index.html`. Replace the SVGs in `assets/projects/` with photos (4:3 or wider, 1600px+ wide) and set `data-type` to `residential`, `commercial`, `mixed-use`, or `renovation` for the filters.
- **Stats** in the home hero use `data-count` for the count-up animation.
- **Testimonials, credentials, and the team names** are illustrative.
- **Social links** are `#` placeholders in the header menu, footer, and contact page.

## Make the forms submit

The contact and newsletter forms are front-end demos: they show a success message without sending anything. To go live, connect a form service and remove the `data-demo` attribute from the `<form>` tag:

- **Formspree:** set `action="https://formspree.io/f/YOUR_ID"` and `method="post"`.
- **Netlify Forms:** add `netlify` and `name="contact"` attributes to the form.
- **Basin, Getform, etc.:** set `action` to the endpoint they give you.

## Brand

- Mark: `assets/brand/mark.svg` (dark) and `assets/brand/mark-light.svg` (light on dark). The same mark is inlined as SVG across the site so it can take the current text colour.
- Reference brand sheet: `assets/brand/builtpoint-brand-sheet.png`.
- Colours: ink `#1E1C1B`, red `#EE3117`, paper `#F2F2F2`. All tokens are at the top of `css/styles.css`.
- Type: Archivo (Google Fonts) with the wide width axis for headings, matching the wordmark.

## Deploy

- **Vercel / Netlify:** import the repo; no build command, output directory is the repo root.
- **GitHub Pages:** Settings → Pages → deploy from the `main` branch root.
