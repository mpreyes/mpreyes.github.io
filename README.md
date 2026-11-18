# Madelyn's Town

My personal site: a little island where each building is one of my projects.
Click a place and pixel-me walks there, then a card links out.

- `src/town.ts` draws the map (SVG) and handles the walking.
- Places, their links and positions live in `PLACES` at the top of `src/town.ts`.
- The artist site moved to [mpreyes/madebit](https://github.com/mpreyes/madebit).

```sh
npm install
npm run dev     # local
npm run build   # type-check and build to dist/
```

Pushing to `master` deploys to GitHub Pages.
