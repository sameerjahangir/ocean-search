import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Libre_Franklin } from 'next/font/google'
import "./globals.css";
import { Rubik } from 'next/font/google'
import '../styles/component-style.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ocean Search",
  description: "Ocean Search is a tool to search for influencers on TikTok and Instagram."
};

const libre_franklin = Libre_Franklin({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-libre_franklin',
})
const rubik = Rubik({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-rubik',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body className={libre_franklin.variable + ' ' + rubik.variable}>
      {children}
      </body>
      </html>
  );
}
