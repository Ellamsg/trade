import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TawkTo from "./components/TawkTo";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Penta Stocks",
  description: "All Trading Made Possible",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="blvck" lang="en">
      <head>
      <link rel="icon" href="https://www.financialprofessionals.org/images/default-source/article-images/bonds-vs-stocks.jpg?sfvrsn=8b80fd6b_0" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
    
        {children}
        <div className='absolute bottom-0 right-0'>
     <TawkTo />
     </div>
      </body>
    </html>
  );
}
