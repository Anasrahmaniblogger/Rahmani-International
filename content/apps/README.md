# Manage Website Apps (`content/apps/apps.json`)

This folder is the single place to edit, add, or remove mobile applications displayed on **Rahmani International** (`https://rahmaniinternational.in`).

Any edit you commit to `content/apps/apps.json` in GitHub automatically updates:
- The Homepage **App Portfolio** cards, category filters, and details modal
- The **Featured App Spotlight** section
- The interactive **3D Mobile Showcase** screens in the Hero section
- SEO structured data (`SoftwareApplication` JSON-LD)

---

## How to Edit an Existing App

Open `content/apps/apps.json` in GitHub and edit any field:

- **`name`**: Display title of the app
- **`logo`**: Either a full HTTPS image URL (e.g., `"https://..."`) **OR** a local icon uploaded into `public/apps/logos/` (e.g., `"/apps/logos/my-app.png"`)
- **`playStoreUrl`**: Official Google Play Store download link
- **`packageId`**: Android package ID (e.g., `"com.app.example"`)
- **`category`**: Short filter tab label (e.g., `"Tools"`, `"Music"`, `"Gaming"`, `"Finance"`, `"Communication"` — new categories automatically create a filter tab!)
- **`categoryLabel`**: Full subtitle shown on cards (e.g., `"Tools / Productivity"`)
- **`accentHex`**: Hex brand color used on the 3D showcase screen (e.g., `"#1a56db"`)
- **`badge`**: Optional short highlight label (e.g., `"Featured App"`)
- **`featuredSpotlight`**: Set `"featuredSpotlight": true` on the one app you want highlighted in the Homepage Spotlight section
- **`description`**: Short summary shown on cards and modals
- **`features`**: List of key feature strings
- **`note`**: Optional legal disclaimer or informational notice

---

## How to Use Local App Logo Images

1. Upload your icon file (PNG, WebP, JPG, or SVG) into:
   ```text
   public/apps/logos/your-app-icon.png
   ```
2. In `content/apps/apps.json`, set:
   ```json
   "logo": "/apps/logos/your-app-icon.png"
   ```
3. Commit and push to GitHub — Vercel automatically redeploys with your updated icon and app details.
