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

## Encryption and accounts (managed inside the app)

`data.json` is encrypted (AES-256-GCM), the same way as the stock-tracker app. Entries, accounts and the GitHub access are all inside the encrypted file.
Each account's password unlocks its own copy of the data key; nothing readable is published, and nobody pastes a token.

**First time (turn encryption on):**
1. Sign in as `admin` (sample password `admin123`) and tap **Users**, then enter your admin password.
2. Choose a new strong admin password (10+ characters, letters and numbers) and tap **Turn on encryption**, confirming with the old password.
   Everyone is signed out. `users.json` is emptied; the other old accounts are not moved. Sign in again with the new password.

**Add people:** **Users** -> name, ID, password (or **Generate**), **Staff** or **Admin** -> **Add user** -> **Copy sign-in details** and send it.
They sign in on their own phone and can add and edit entries straight away. Changes take effect at once.

**Disable or delete someone** renews the data key and re-wraps it for everyone else, so that person's phone can no longer open the data.
Other people are signed out once and sign in again with the same password. **Reset password** gives someone a new one.

**Staff** can add entries and change statuses and DO numbers. **Admins** can also delete entries, clear all data and manage users.

## Good to know

- Sign-in on a new phone reads the encrypted `data.json` without a token, so the repository must be **public** (or the site published) for that to work. The content stays unreadable without a password.
- Choose long passwords: someone who downloads `data.json` can try passwords offline. A removed person had seen the GitHub token: after removing someone, make a new token and connect with it from **sync status** (the admin's connection is shared to everyone automatically; other devices pick it up on their own).
- The staff/admin difference is a screen limit: every signed-in account holds the data key, so a technical person could still change data directly.
- Earlier versions of `data.json` and `users.json` stay in the repository history. Delete `users.json` and consider a new repository (or rewrite the history) if the old data was sensitive.
- Entries can only be saved while the device is online.
- After changing any file in the repository, edit `CACHE_VERSION` in `service-worker.js` so installed copies of the app update.
