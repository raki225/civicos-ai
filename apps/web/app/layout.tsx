import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { PreferencesProvider } from "@/components/PreferencesProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "CivicOS AI — Infrastructure intelligence", template: "%s · CivicOS AI" },
  description: "A multilingual, voice-enabled platform to report, understand, and track civic infrastructure issues.",
  applicationName: "CivicOS AI",
  keywords: ["civic technology", "infrastructure", "public works", "AI", "India"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f7f6" },
    { media: "(prefers-color-scheme: dark)", color: "#071116" },
  ],
};

const preferenceScript = `
  (() => {
    try {
      const storedTheme = localStorage.getItem("civicos-theme");
      const theme = storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      const storedLanguage = localStorage.getItem("civicos-language");
      const language = storedLanguage === "hi" || storedLanguage === "te" ? storedLanguage : "en";
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
      document.documentElement.lang = language === "hi" ? "hi-IN" : language === "te" ? "te-IN" : "en-IN";
    } catch (_) {}
  })();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: preferenceScript }} /></head>
      <body>
        <PreferencesProvider>
          <a className="skip-link" href="#main-content">Skip to content</a>
          <Nav />
          <main id="main-content">{children}</main>
          <Footer />
        </PreferencesProvider>
      </body>
    </html>
  );
}
