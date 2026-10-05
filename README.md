# Satay Supply Dashboard

A web app (works on phones and computers) for vendor transactions and payments.
All entries are saved in **`data.json`** in this repository, so every device shows the same, up-to-date data.

## Set up (about 10 minutes)

1. **Create a repository** on GitHub (for example `satay-dashboard`) and upload every file in this folder to it.
2. **Turn on GitHub Pages:** repository *Settings -> Pages -> Build and deployment -> Deploy from a branch -> `main` / `(root)` -> Save*.
   After a minute the app is live at `https://YOUR-NAME.github.io/satay-dashboard/`.
3. **Create an access token** (lets the app save `data.json`):
   *GitHub profile picture -> Settings -> Developer settings -> Personal access tokens -> Fine-grained tokens -> Generate new token*.
   - Repository access: **Only select repositories** -> choose this repository
   - Permissions -> Repository permissions -> **Contents: Read and write**
   - Pick an expiry date, generate, and copy the token (it starts with `github_pat_`).
4. **Open the app, sign in, and paste the token** into the "Connect to GitHub" box (the repository name is filled in for you).
   Do this once on each phone / computer. Then add your first entry - it is saved to `data.json` straight away.

## Accounts

Sample sign-ins in `users.json`: `admin` / `admin123` and `staff` / `staff123`. **Change them before sharing the app.**
Staff can add and update entries; only admins can delete entries or clear all data (clearing asks for the admin password again).

## Good to know

- Anyone who can open the site can read `users.json` and, if the repository is public, `data.json`. Keep the repository **private** if the figures are confidential (GitHub Pages from a private repository needs a paid GitHub plan, as far as I know).
- The token can change this repository, so keep it to this one repository and only give it to people you trust. Make a new token when it expires or if one is lost.
- Entries can only be saved while the device is online.
- After changing any file in the repository, edit `CACHE_VERSION` in `service-worker.js` so installed copies of the app update.
