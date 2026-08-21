# BlockDev — Protocol & Security Engineering

A dependency-free, responsive business website designed for GitHub Pages.

It presents an independent software engineering practice focused on:

- Blockchain Layer 1 core engineering
- KMS/HSM and hardware-assisted security using Intel SGX and ARM TrustZone
- Network-security research involving protocol dialects
- Open-source contributions across the Kaia ecosystem

## Preview locally

From the repository root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

No package manager, build command, framework, or external font is required.

## Personalize before publishing

The only intentionally omitted details are the registered business name and personal contact/profile URLs. Edit `site.config.js`:

```js
window.SITE_CONFIG = Object.freeze({
  displayName: "Your Name",
  businessName: "Your Business Name",
  email: "you@example.com",
  githubUrl: "https://github.com/your-user-name",
  linkedinUrl: "https://www.linkedin.com/in/your-profile",
  location: "Republic of Korea",
  availability: "Currently committed to a full-time engagement"
});
```

Empty optional fields are hidden automatically. Once any personal contact link is configured, it replaces the fallback “Open-source work” button in the contact section.

Also review these parts of `index.html`:

1. The `<title>`, description, and social metadata near the top.
2. The wording of the current Kaia Foundation engagement.
3. Any experience details you want to make more specific.
4. `assets/social-card.png` if you change the displayed name or title.
5. After the final Pages URL is known, make the `og:image` and `twitter:image` values absolute URLs for the most reliable social previews.

## Publish with GitHub Pages

### Personal site

1. Create a public repository named `<your-github-username>.github.io`.
2. Copy this project into the repository.
3. Commit and push to the `main` branch.
4. Open **Repository Settings → Pages**.
5. Under **Build and deployment**, select **GitHub Actions** as the source.
6. The included `.github/workflows/pages.yml` workflow will deploy the site.

The resulting URL is:

```text
https://<your-github-username>.github.io/
```

### Project site

You can instead use any repository name. The URL will normally be:

```text
https://<your-github-username>.github.io/<repository-name>/
```

All internal asset paths are relative, so both personal and project Pages sites are supported.

## Custom domain

After configuring a custom domain in **Repository Settings → Pages**, add a `CNAME` file at the project root containing only the domain name:

```text
www.example.com
```

Then configure the DNS records requested by GitHub.

## Structure

```text
.
├── .github/workflows/pages.yml   # GitHub Pages deployment
├── assets/
│   ├── favicon.svg
│   ├── main.js
│   ├── social-card.png
│   └── styles.css
├── .nojekyll
├── 404.html
├── index.html
├── manifest.webmanifest
├── robots.txt
└── site.config.js                # Name and contact customization
```

## Design and implementation notes

- Semantic HTML and keyboard-accessible navigation
- Responsive layouts for desktop, tablet, and mobile
- No tracking, cookies, third-party scripts, or remote assets
- Animated protocol-network background rendered locally with Canvas
- Animation is disabled for visitors who prefer reduced motion
- Contact fields are kept in one small configuration file
- Kaia and CySecuLab names are referenced textually without copying brand assets

## License

The source template is provided under the MIT License. Review any personal writing, company names, trademarks, and linked material separately before publication.
