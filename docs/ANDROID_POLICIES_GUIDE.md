# Android Application Policy File Guide (`public/policies/`)

All Android application policy documents for **Rahmani International** are hosted as standalone static files inside `public/policies/` and deployed via **GitHub → Vercel**.

**Important**: Policy files are **never** displayed or listed on the website homepage, app cards, navigation bar, footer, or sitemap. They are accessible **only via their direct HTTPS URLs**.

---

## 1. Folder Structure

```text
public/
  policies/
    privacy-policy/
      multi-tool-app/
        index.html
    terms-and-conditions/
      multi-tool-app/
        index.html
    refund-policy/
      multi-tool-app/
        index.html
    money-back-guarantee/
      multi-tool-app/
        index.html
    cancellation-policy/
      multi-tool-app/
        index.html
    disclaimer/
      multi-tool-app/
        index.html
    data-safety-policy/
      multi-tool-app/
        index.html
    advertising-policy/
      multi-tool-app/
        index.html
    app-permissions-policy/
      multi-tool-app/
        index.html
    third-party-services-policy/
      multi-tool-app/
        index.html
    support-policy/
      multi-tool-app/
        index.html
    additional-policies/
      multi-tool-app/
        custom-policy.html
```

This structure is completely extensible. You can create new app folders (e.g., `swarx/`, `wa-direct-chat/`, `sarkari-yojana-calculator/`, `booyah-challenge/`) or new policy categories at any time in GitHub. Both `.html` and `.txt` files are supported without renaming.

---

## 2. How to Determine Any Direct Policy URL

Strip the leading `public/` prefix from the GitHub file path and prepend `https://rahmaniinternational.in/`:

| GitHub Repository File Path (Source Management Only) | Deployed Public Policy URL (Use in Google Play Console / Apps) |
| --- | --- |
| `public/policies/privacy-policy/multi-tool-app/index.html` | `https://rahmaniinternational.in/policies/privacy-policy/multi-tool-app/index.html` |
| `public/policies/terms-and-conditions/multi-tool-app/index.html` | `https://rahmaniinternational.in/policies/terms-and-conditions/multi-tool-app/index.html` |
| `public/policies/refund-policy/multi-tool-app/index.html` | `https://rahmaniinternational.in/policies/refund-policy/multi-tool-app/index.html` |
| `public/policies/money-back-guarantee/multi-tool-app/index.html` | `https://rahmaniinternational.in/policies/money-back-guarantee/multi-tool-app/index.html` |
| `public/policies/cancellation-policy/multi-tool-app/index.html` | `https://rahmaniinternational.in/policies/cancellation-policy/multi-tool-app/index.html` |
| `public/policies/disclaimer/multi-tool-app/index.html` | `https://rahmaniinternational.in/policies/disclaimer/multi-tool-app/index.html` |
| `public/policies/data-safety-policy/multi-tool-app/index.html` | `https://rahmaniinternational.in/policies/data-safety-policy/multi-tool-app/index.html` |
| `public/policies/advertising-policy/multi-tool-app/index.html` | `https://rahmaniinternational.in/policies/advertising-policy/multi-tool-app/index.html` |
| `public/policies/app-permissions-policy/multi-tool-app/index.html` | `https://rahmaniinternational.in/policies/app-permissions-policy/multi-tool-app/index.html` |
| `public/policies/third-party-services-policy/multi-tool-app/index.html` | `https://rahmaniinternational.in/policies/third-party-services-policy/multi-tool-app/index.html` |
| `public/policies/support-policy/multi-tool-app/index.html` | `https://rahmaniinternational.in/policies/support-policy/multi-tool-app/index.html` |
| `public/policies/additional-policies/multi-tool-app/custom-policy.html` | `https://rahmaniinternational.in/policies/additional-policies/multi-tool-app/custom-policy.html` |

> **Important Distinction**:
> - **GitHub File URL** (`https://github.com/<user>/<repo>/blob/main/public/policies/...`) is ONLY for viewing/editing the source file in GitHub.
> - **Deployed HTTPS Policy URL** (`https://rahmaniinternational.in/policies/...`) is the official public URL to paste into Google Play Console or inside your Android app.

---

## 3. Manual GitHub Workflow (Read-Only Website)

1. In GitHub, navigate to `public/policies/<policy-category>/`.
2. Create a folder for your app (for example `swarx/`) and upload your `index.html` or `.txt` policy file.
3. Commit the changes to your main branch.
4. Vercel automatically deploys the updated site.
5. Open your direct URL (`https://rahmaniinternational.in/policies/<policy-category>/<app-slug>/<filename>`) to verify it loads over HTTPS, then copy and paste it into Google Play Console.

There is no database, admin dashboard, or public upload interface — visitors have strictly read-only access to the live website, and all modifications happen exclusively through your GitHub repository.
