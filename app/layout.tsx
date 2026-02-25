import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://riskmetre.local"),
  title: {
    default: "RiskMetre | Kişiselleştirilmiş Artçı Deprem Riski",
    template: "%s | RiskMetre",
  },
  description:
    "RiskMetre, AFAD verileri ve bilimsel modellere dayalı olarak konumunuza özel artçı deprem riskini hesaplar. Bu bir deprem tahmini değildir; istatistiksel bir olasılık hesabıdır. Yunus Emre",
  applicationName: "RiskMetre",
  keywords: [
    "deprem",
    "artçı",
    "risk",
    "AFAD",
    "Türkiye deprem",
    "afet",
    "risk analizi",
    "deprem olasılığı",
  ],
  authors: [{ name: "RiskMetre" }],
  creator: "RiskMetre",
  publisher: "RiskMetre",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "RiskMetre",
    title: "RiskMetre | Kişiselleştirilmiş Artçı Deprem Riski",
    description:
      "Konumunuza en yakın depremleri ve artçı olasılığını görerek daha bilinçli karar verin. Bilimsel modellere dayalı istatistiksel analiz.",
    images: [
      {
        url: "/globe.svg",
        width: 1200,
        height: 630,
        alt: "RiskMetre",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RiskMetre | Kişiselleştirilmiş Artçı Deprem Riski",
    description:
      "AFAD verileri ve bilimsel modellere dayalı konum bazlı artçı deprem olasılığı.",
    images: ["/globe.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  themeColor: "#111827",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
