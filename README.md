# blimmy

Siriphanaphorn Sirikun’s cybersecurity portfolio. A static Next.js site with an editorial design, GSAP scroll storytelling, an interactive terminal, and an MDX research archive.

**Website:** https://blimmy.github.io · **Source:** https://github.com/blimmy/blimmy.github.io

## Run locally

Requires Node.js 24 and npm. Python 3 is used only for the local static preview/test server.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. If Node is installed with Homebrew but is not in your path:

```sh
export PATH="/opt/homebrew/opt/node@24/bin:$PATH"
```

Production build and preview:

```sh
npm run build
npm run preview
```

Open http://localhost:4173. The complete static site is in `out/`; no Node server, database, API keys, or runtime backend is needed for hosting. Fonts are bundled and served locally.

## Project structure

```text
app/                      Homepage, responsive CSS, metadata, static routes
app/research/[slug]/       Shared research detail page
components/               Terminal, navigation, animation, galleries, skills
content/writeups/         Local trusted .mdx files
 data/profile.ts          Identity, education, contact and resume link
 data/achievements.ts     Competition and recognition records
 data/certificates.ts     Training / certificate slots
 data/projects.ts         Projects and their optional media / links
 data/experience.ts       Internship and leadership
 data/skills.ts           Skills with evidence / practical context
 data/writeups.ts         Research metadata and publishing status
lib/                      Shared content ordering and safe terminal parser
public/assets/            Resume, certificates, screenshots
 tests/                   Playwright interaction and accessibility checks
.github/workflows/        Build, test, and GitHub Pages deployment
```

## แก้ไขเนื้อหา / Content guide

ข้อมูลส่วนตัวทั้งหมดอ้างอิงจาก `Siriphanaphorn_Sirikun_Resume.png` ที่ได้รับมา ไม่ได้สร้างรางวัล ผลงาน หรือใบประกาศเพิ่ม ช่องที่ยังไม่มีข้อมูลใช้ `null` หรือข้อความ pending

Each collection supports `visible: false` to hide a record and `order` to change its position. Keep IDs unique. The terminal reads these same collections. The record with ID `tctt` receives the featured panel; its `displayRank` and `rankSuffix` control the large award typography. Hiding it also hides the feature.

### 1. เพิ่มรางวัล / Add an achievement

Add a record to `data/achievements.ts` using an existing entry as the template. Set `title`, `year`, `placement`, `category`, and `description` from the actual award. Add `proof` (a local asset path or public URL) and `url` (official competition page) only when available. Do not infer an unknown ranking. `major: true` gives the result more visual emphasis.

### 2. เพิ่มรูปใบประกาศ / Upload a certificate

1. Copy the real image to `public/assets/certificates/`, e.g. `ncsa-foundation.webp`.
2. In `data/certificates.ts`, change `image: null` to `image: '/assets/certificates/ncsa-foundation.webp'`.
3. Fill in the actual `date`, `verificationUrl`, and `credentialId` when known. Leave unknown values `null`.
4. Commit and push. The existing frame handles portrait and landscape images with `object-fit: contain`; clicking opens the full image with 100–300% zoom, scrolling, Escape to close, and keyboard focus containment.

Empty or failed image loads show an intentional placeholder. For a new credential, duplicate an entry and change its unique `id` and `order`. Remove or hide unused entries. The gallery’s filter options are derived from the records. Adding files to the repository is the persistent upload method; there is no public upload form or CMS.

The Cisco entry is grouped exactly as supplied in the resume. Split it into two records only when the actual certificate details are available.

### 3. เผยแพร่ CTF writeup / Publish research

1. Copy `content/writeups/writeup-template.mdx` to a unique filename such as `your-challenge.mdx`.
2. Replace every placeholder with reviewed, factual content: challenge title, competition, category, difficulty (if known), technologies, technique, summary, explanation, screenshots, code, and lessons learned.
3. Add a metadata entry to `data/writeups.ts` with `slug: 'your-challenge'`, `status: 'published'`, `visible: true`, and an `order`. Filename and slug must match.
4. Add images to `public/assets/writeups/` and embed them with Markdown:

```md
![Descriptive screenshot alt text](/assets/writeups/your-challenge.webp)
```

Use fenced code blocks with a language (`python`, `bash`, `c`, etc.) for highlighting and a copy button. Use `<details><summary>Technical details</summary>…</details>` for expandable notes; leave blank lines around Markdown inside the HTML.

`draft` records are excluded from the site and generated routes. `template` records have a visible template label and `noindex`; they are excluded from the sitemap. Remove/hide the template when real writeups are ready. Only trusted repository MDX is compiled at build time; never accept MDX uploads from visitors.

### 4. เพิ่มภาพโปรเจกต์ / Add project screenshots

Copy an optimized image into `public/assets/projects/` and set the project’s `image` path in `data/projects.ts`. Fill `github`, `demo`, and `outcome` only with verified information. Null images retain the custom typographic artwork and “screenshot pending” label. Null repository links remain non-clickable pending labels. Edit `highlights`, `stack`, `role`, and `problem` as the project develops.

For best performance, use WebP or AVIF where possible, roughly 1600 pixels wide or less, and avoid unnecessarily large files. The gallery lazy-loads images below the fold.

### 5. เปลี่ยนเรซูเม่ / Update your resume

Replace the asset in `public/assets/resume/` and update `profile.resume` in `data/profile.ts`. A PDF is supported by simply changing the path to the PDF. Update the structured collections to match the new resume; they are deliberately not generated from an image at runtime. The original PNG is currently used for download. Update “Present” and graduation dates when needed.

### 6. แก้หน้าแรก / Change homepage content

- Identity, education, email, GitHub, LinkedIn, resume: `data/profile.ts`.
- Set `profile.linkedin` to the actual public URL; it is currently pending because the resume supplied a display name only.
- Editorial headings and section layout: `app/page.tsx`.
- Palette, typography, responsive layout: `app/globals.css`.
- Scroll behavior and motion preference: `components/MotionSystem.tsx`.
- SEO and social sharing: `app/layout.tsx`, `public/opengraph.png`, `app/sitemap.ts`.

## Interaction and accessibility

The terminal accepts only predefined commands; no `eval`, shell execution, or network commands. Commands: `help`, `whoami`, `ls`, `skills`, `achievements`, `projects`, `experience`, `certificates`, `contact`, `clear`, `cat resume.txt`. Arrow keys recall up to 100 commands; Tab completes a recognized prefix; Ctrl+L clears. Empty input does not trap Tab. Output is capped to 50 entries.

Desktop cinematic motion uses GSAP ScrollTrigger and Lenis on the same ticker. It pins the hero and project exhibition, scrubs typography and background color, and keeps browser-native scrolling. The project controls and keyboard focus move to the correct panel. Mobile, reduced motion, and disabled JavaScript use a normal vertical gallery. The on-page motion toggle disables cinematic motion immediately. Native dialogs handle focus containment and Escape. Core content is statically rendered and available before hydration.

## Verify

```sh
npx playwright install chromium
npm run build
npm test
```

The tests cover factual content rendering, terminal history/autocomplete/safe error handling, certificate filtering and dialogs, research search, MDX code copy, mobile navigation/overflow, keyboard project navigation, motion toggling, no-JavaScript readability, and automated WCAG A/AA checks. Automated checks complement manual desktop/mobile inspection; they are not a substitute for a complete assistive-technology audit.

## Deploy to GitHub Pages

The repository is `blimmy/blimmy.github.io`, so it serves from the domain root. Settings → Pages → Build and deployment → **GitHub Actions**.

```sh
git add .
git commit -m "Update portfolio content"
git push origin main
```

The workflow installs pinned dependencies from `package-lock.json`, builds the static export, runs browser checks, and deploys `out/` only if they pass. Watch the repository’s Actions tab for status. A failed build/test keeps the last successful deployment live. To roll back, revert the unwanted commit and push.

If you move to a project repository such as `username.github.io/repository/`, update Next.js `basePath`, asset paths, navigation, metadata, and sitemap together. This version intentionally targets `https://blimmy.github.io/`.

References: [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports), [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).
