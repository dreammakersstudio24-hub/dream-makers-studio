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
  title: "Dream Makers Studio - Transform Your Space",
  description: "Official Dream Makers Studio AI Interior Design App.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png?v=3",
    apple: "/icon.png?v=3",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DM Studio",
    startupImage: [
      "/icon.png"
    ]
  },
  other: {
    "p:domain_verify": "568974dd6d79ee4cfbe0fc5ffda56994",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

import { Navbar } from "@/components/Navbar";
import { PwaInstall } from "@/components/PwaInstall";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-50 text-neutral-900`}
      >
        <Navbar />
        {children}
        <PwaInstall />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}

function ServiceWorkerRegister() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').then(function(registration) {
                console.log('SW registered');
              }, function(err) {
                console.log('SW failed: ', err);
              });
            });
          }
        `,
      }}
    />
  );
}
