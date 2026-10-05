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

## Accounts (managed inside the app)

1. Sign in as `admin` (the sample password is `admin123`) and tap **Users** at the top. Enter your admin password again to open it.
2. First, tap **Reset password** on your own row and give yourself a strong password. Delete or reset the sample `staff` account too.
3. To add someone: fill in their name, an ID and a password (or tap **Generate**), choose **Staff** or **Admin**, and tap **Add user**.
   Then tap **Copy sign-in details** and send them the link, ID and password.
4. Their sign-in works about a minute later (GitHub has to publish the change). They sign in and can add and edit entries straight away -
   with "connect automatically" ticked, they never need the GitHub token.

**Staff** can add entries and change statuses and DO numbers. **Admins** can also delete entries, clear all data and manage users.
Passwords need at least 10 characters with letters and numbers. Do not upload a new `users.json` once you have added people in the app - it would replace them.

## Good to know

- Anyone who can open the site can read `users.json` and, if the repository is public, `data.json`. With "connect automatically", `users.json` also holds the GitHub access, locked with each person's password - so give everyone a strong password, because a weak one could be guessed and would give write access to this repository. Keep the repository **private** if the figures are confidential (GitHub Pages from a private repository needs a paid GitHub plan, as far as I know).
- The token can change this repository, so keep it to this one repository and only give it to people you trust. When the token expires, or someone leaves: make a new token, connect your device with it, then **reset every other person's password** (that saves the new token into their account).
- Entries can only be saved while the device is online.
- After changing any file in the repository, edit `CACHE_VERSION` in `service-worker.js` so installed copies of the app update.
