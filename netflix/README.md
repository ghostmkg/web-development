# Netflix Clone (React + Vite)

A small Netflix-like UI built with React and Vite that fetches movie data from The Movie Database (TMDb) API and uses Firebase for authentication and Firestore.

This README explains the project at a glance and how to run it locally.

## Project overview

- UI: React components (Vite dev server)
- Data: The Movie Database API (requests require an API token or key)
- Auth & DB: Firebase (used for authentication and storing user info)

Key features:
- Browse movie lists (Popular / Now Playing / Category-based)
- Click a title to view or play (routes to `/player/:id`)
- Authentication (signup, login) using Firebase

## Prerequisites

- Node.js (v16 or later recommended)
- npm or yarn
- A TMDb API token (recommended to use a read-only/limited token)
- Firebase project credentials (apiKey, authDomain, projectId, etc.)

## Environment variables

Create a `.env` file inside the `netflix/` folder. This repository ignores `.env`, so it will not be committed.

Required variables (example names used by this project):

- REACT_APP_FIREBASE_API_KEY=
- REACT_APP_FIREBASE_AUTH_DOMAIN=
- REACT_APP_FIREBASE_PROJECT_ID=
- REACT_APP_FIREBASE_STORAGE_BUCKET=
- REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
- REACT_APP_FIREBASE_APP_ID=
- REACT_APP_FIREBASE_MEASUREMENT_ID=
- REACT_APP_MOVIE_DB_BEARER=    # TMDb Bearer token (or you can adapt the code to use an API key)

Do NOT commit your `.env`. If you want to share the required names without secrets, add a `.env.example` with placeholder values.

## Install dependencies

From the `netflix/` directory run:

```powershell
# using npm
npm install

# or with yarn
yarn
```

## Run locally (development)

```powershell
npm run dev
# or
yarn dev
```

Open http://localhost:5173 (or the port shown by Vite) in your browser.

## Build for production

```powershell
npm run build
# or
yarn build
```

Then preview the built site:

```powershell
npm run preview
# or
yarn preview
```

## Notes about secrets and git history

- Adding the keys to `.env` prevents future commits from including them, but any keys already committed remain in git history. If a secret was committed before, rotate the secret in the provider (recommended).
- If you need help removing secrets from history, I can provide steps to use the BFG Repo-Cleaner or git filter-repo.

## Troubleshooting

- If the app can't fetch movie data, ensure `REACT_APP_MOVIE_DB_BEARER` is set and valid, or change the fetch logic to use an API key instead.
- If Firebase fails to initialize, check that all `REACT_APP_FIREBASE_*` vars are correct.

## Contributing

If you add features or change env var names, update this README and consider adding a `.env.example` file.

---

If you want, I can also add a `netflix/.env.example` file with placeholders and remove the fallback literals from code to force env usage. Tell me which option you prefer.
