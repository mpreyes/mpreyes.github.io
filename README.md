# madebit.studio

The madebit artist site: a little console you play. Drag (or tap) a cartridge into the console and it loads on the TV.

- **MUSIC**: the madebit solar system. Every release is a planet; click one for tracks, streaming links, and name-your-price instrumentals / a cappellas.
- **VIDEOS**: flip through YouTube channels.
- **ITEM SHOP**: merch, checkout on Bandcamp.
- **MAILBOX**: the Mailchimp list.
- **PLAYER 1**: about.
- **THE DESK**: the old desk, now with cookies you can dunk.

## Editing content

Almost everything (releases, tracks, links, videos, merch, socials) lives in [`src/data.ts`](src/data.ts). Lines marked `TODO` are placeholders.

Cover art comes from the full-size files in `img/music-artwork/`. The build makes small web copies automatically.

## Running it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
```

## Deploying

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages at madebit.studio.
One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Built with Vite, React and TypeScript. Fonts: Press Start 2P and Space Mono.
