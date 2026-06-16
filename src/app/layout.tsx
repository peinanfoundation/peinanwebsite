import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "培楠愛國教育基金 | PEI NAN Patriotic Education Foundation",
  description:
    "培楠愛國教育基金致力支援基層學童、推動青少年國民教育及社區發展服務，以生命影響生命，共建關懷社區。",
  keywords: ["培楠", "愛國教育", "基層學童", "國民教育", "社區服務", "香港"],
  openGraph: {
    title: "培楠愛國教育基金",
    description: "以生命影響生命，共建關懷社區",
    locale: "zh_HK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-HK" className={`${notoSansTC.variable} scroll-smooth bg-surface`}>
      <body className="min-h-screen bg-surface font-sans text-gray-900 antialiased">
        <ScrollProgressBar />
        <Header />
        <main className="bg-surface">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
