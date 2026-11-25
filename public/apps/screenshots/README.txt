Rahmani International — 3D Phone App Screenshots Folder
=======================================================

Upload your mobile app screenshots here to preview them directly inside
the interactive 3D smartphone on the homepage!

Recommended Screenshot Specs:
- Format: PNG, WebP, or JPG
- Orientation: Portrait (Android phone screenshot, e.g., 1080x1920 or 9:16 / 9:19)
- File size: Under 500 KB for fast loading

How to Add a Screenshot (GitHub -> Vercel):
1. Upload your screenshot file into this folder:
   public/apps/screenshots/swarx.png
2. Open content/apps/apps.json and set the "screenshot" field for that app:
   "screenshot": "/apps/screenshots/swarx.png"
3. Commit your changes to GitHub. Vercel will automatically redeploy and
   display your real app screenshot inside the 3D phone!

Note:
- You can also use a direct HTTPS image URL (that allows CORS), or leave
  "screenshot": "" empty to show the built-in stylized app preview card.
