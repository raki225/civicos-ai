import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "CivicOS AI — Infrastructure intelligence",
  description: "Report, understand, and track civic infrastructure issues.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable}`}>
        <Nav />
        <main>{children}</main>
        <footer className="footer container"><span>CivicOS AI · Accountable infrastructure intelligence</span><span>Privacy · Accessibility · Data policy</span></footer>
      </body>
    </html>
  );
}

