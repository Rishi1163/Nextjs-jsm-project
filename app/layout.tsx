import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import Aurora from '../components/Aurora';
import Navbar from "@/components/Navbar";
import PHProvider from "./providers/PostHogProvider";
import PostHogPageView from "./providers/PostHogPageView";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevEvent",
  description: "The Hub For Every Dev Event You Mustn't Miss",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${schibstedGrotesk.variable} ${martianMono.variable} min-h-screen antialiased`}
      >
      <Navbar />
      <div className={`absolute inset-0 top-0 z-0 min-h-screen`}>
          <Aurora
              colorStops={["#7C7CFF","#22D3EE","#A855F7"]}
              blend={0.5}
              amplitude={1.0}
              speed={0.8}
          />
      </div>
        <main className={`relative z-10`}>
            <PHProvider>
                <PostHogPageView />
                {children}
            </PHProvider>
        </main>
      </body>
    </html>
  );
}
