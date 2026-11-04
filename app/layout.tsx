import type { Metadata } from "next";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";

// Prioritize the large greeting; secondary fonts are discovered from CSS.
// One variable file covers every Manrope weight, with adjusted fallbacks.
const display = localFont({
  src: "../node_modules/@fontsource/anton/files/anton-latin-400-normal.woff2",
  variable: "--font-display",
  weight: "400",
  display: "swap",
  fallback: ["Impact", "sans-serif"],
});
const sans = localFont({
  src: "../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  variable: "--font-sans",
  weight: "200 800",
  display: "swap",
  preload: false,
  fallback: ["Arial", "sans-serif"],
});
const mono = localFont({
  src: "../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2",
  variable: "--font-mono",
  weight: "400",
  display: "swap",
  preload: false,
  fallback: ["monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://blimmy.github.io"),
  title: {
    default: "blimmy — Breaking Systems. Building Better Ones.",
    template: "%s / blimmy",
  },
  description:
    "Siriphanaphorn Sirikun. Computer Science, cybersecurity, and IT audit. Explore competition achievements, systems projects, and a growing security research archive.",
  openGraph: {
    title: "blimmy",
    description: "Breaking Systems. Building Better Ones.",
    type: "website",
    url: "https://blimmy.github.io",
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 630,
        alt: "blimmy — Breaking Systems. Building Better Ones.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "blimmy",
    description: "Breaking Systems. Building Better Ones.",
    images: ["/opengraph.png"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <noscript>
          <style>{`@media(max-width:640px){.site-header{height:auto;min-height:62px;flex-wrap:wrap;padding-top:10px;padding-bottom:10px}.nav-links{position:static;display:flex;flex-direction:row;overflow:auto;padding:0;border:0;gap:20px;box-shadow:none;width:100%}.nav-links a{font-size:10px;white-space:nowrap;padding:8px 0;border:0}.nav-links .nav-resume{padding:8px 0;margin:0}.menu-toggle{display:none}.hero{padding-top:125px}}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
