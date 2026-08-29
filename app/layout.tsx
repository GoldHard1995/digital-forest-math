import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '數字森林｜中學數學冒險平台',
  description: '供香港中一學生鞏固有向數加減法的數學小遊戲平台原型。',
  openGraph: {
    title: '數字森林｜中學數學冒險平台',
    description: '供香港中一學生鞏固有向數加減法的數學小遊戲平台原型。',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '數字森林｜中學數學冒險平台',
    description: '供香港中一學生鞏固有向數加減法的數學小遊戲平台原型。',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
