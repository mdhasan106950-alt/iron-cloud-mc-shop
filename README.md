# IRON CLOUD MC

Official website for IRON CLOUD MC — a Java and Bedrock Minecraft server built for players who want to play with people.

## Structure

| File | What it is |
|---|---|
| `index.html` | Homepage: hero, stats, benefits, how it works, team, FAQ, final CTA |
| `store.html` | Storefront landing page |
| `ranks.html` | Rank packages (Hero → IMMORTAL) |
| `coins.html` | In-game coin packages |
| `keys.html` | Crate key packages |
| `payment.html` | Purchase form (Bkash/Nagad) |
| `about.html` | Story, history, mission |
| `team.html` | Management, admin, moderation, helpers |
| `support.html` | Contacts and FAQ |
| `privacy.html` / `terms.html` | Legal pages |
| `404.html` | Custom not found page |
| `css/` | Self-hosted Manrope, Geist Mono, Phosphor icons, and the design system |
| `js/main.js` | Nav, reveals, tagline reveal, counters, clipboard copy |
| `js/store.js` | Product selection, payment methods, validation |

## Assets

- Fonts: Manrope (400-700) + Geist Mono (500, 600), self-hosted in `fonts/`
- Icons: Phosphor (regular), self-hosted in `icons/` (subset only, see `css/icons.css`)
- Images: `images/hero-art.png` (AI generated in-site art), `images/server-preview.jpg`, `images/logo.png` (site brand) and generated favicon `images/favicon.svg`

## Preview locally

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/index.html`.

## Deployment

Static site, deployed to GitHub Pages (see `.github/workflows/static.yml`).

## Notes

- Stats are deliberately marked as approximate (`~`). There is no public analytics feed.
- No testimonials are published until real player quotes exist.
