# robert

Personal site: [Next.js](https://nextjs.org) 16, React 19, Tailwind. The landing page is an interactive pixel koi pond;
the rest is projects, writing, and a small photo gallery. Content lives in `src/lib/data.ts`.

## Credit

The design, the koi pond, and much of the site's code are adapted from
[Dao Ho's portfolio](https://github.com/Dao-Ho/portfolio) ([daoho.dev](https://www.daoho.dev)). Thank you, Dao.

## Develop

```bash
npm install
npm run dev
```

`just check` runs lint, format check, and type check; `npm run build` builds for production.

Images under `public/` go through `npm run media:optimize` before they are committed; see [docs/media.md](docs/media.md).
