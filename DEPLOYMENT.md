# 黛珂婚礼 · Clark & Dai Dai's Wedding Site

This project is a bilingual English / Simplified Chinese wedding archive built with React, Vite, Express, tRPC, Drizzle, and Manus OAuth.

## Deploying to GitHub and Vercel

1. Push the repository to GitHub, including `vercel.json`, `api/index.ts`, `client/public/clark-daidai-hero.webp`, and the `client/public/photos/` directory.
2. Import the repository into Vercel. The repository already declares `pnpm build` as the build command and `dist/public` as the output directory.
3. Configure the production environment variables used by the existing server and authentication flow: `DATABASE_URL`, `JWT_SECRET`, `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, `OWNER_OPEN_ID`, `OWNER_NAME`, `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `VITE_FRONTEND_FORGE_API_URL`, and `VITE_FRONTEND_FORGE_API_KEY`.
4. Point the OAuth callback configuration at the deployed Vercel domain and verify that the database contains the `users` and `guest_messages` tables.
5. Redeploy after environment variables are saved. The `/api` Serverless Function handles OAuth and tRPC requests while Vercel serves the Vite-built HTML assets and self-contained WebP photographs.

## Language behavior

The first visit uses the browser language: Chinese browsers start in Simplified Chinese and other browsers start in English. The top-right `E / 中` control switches languages and remembers the visitor's choice in local storage.
