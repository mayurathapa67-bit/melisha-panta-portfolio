import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Melisha Panta — Digital Marketing Specialist",
    template: "%s | Melisha Panta",
  },
  description:
    "Melisha Panta is a Digital Marketing Specialist driving measurable growth through data-driven SEO, PPC, social, content, and email marketing.",
  keywords: [
    "Digital Marketing Specialist",
    "SEO",
    "PPC",
    "Social Media Marketing",
    "Content Marketing",
    "Melisha Panta",
  ],
  authors: [{ name: "Melisha Panta" }],
  openGraph: {
    title: "Melisha Panta — Digital Marketing Specialist",
    description:
      "Driving measurable growth through data-driven marketing strategies.",
    type: "website",
    locale: "en_AU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-charcoal">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
