import type { Metadata } from "next";
import "@fontsource/anton/latin-400.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-700.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "./globals.css";
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
    <html lang="en">
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
