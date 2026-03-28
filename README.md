This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy (live URL on every push)

This app is meant to deploy with **[Vercel](https://vercel.com)** connected to **GitHub**. After you connect the repo, Vercel gives you a production URL for `main` and **preview URLs** for branches and pull requests (the Vercel bot comments on PRs with the link).

### One-time setup

1. Push this repository to GitHub (if it is not already).
2. In [Vercel](https://vercel.com/new), choose **Import** → your GitHub repo **`havoc-undr-heaven`** (or whichever repo contains this project).
3. **Framework preset:** Next.js (auto-detected).
4. **Root directory:** leave as `.` if `package.json` is at the repo root. If the Next app lives in a subfolder in that remote, set **Root Directory** to that folder (e.g. `web`).
5. **Build command:** `npm run build` (default). **Output:** Next.js default (no static export).
6. Install the **Vercel** GitHub app when prompted so checks and deployment comments appear on commits and PRs.
7. Deploy. Copy the **Production** domain from the Vercel project; future pushes to `main` update it automatically.

### CI on GitHub

The workflow in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs `lint` and `build` on pushes and PRs to `main`/`master` so broken builds are caught before or alongside deploy.

### Further reading

- [Next.js deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [Vercel + GitHub](https://vercel.com/docs/deployments/git/vercel-for-github)
