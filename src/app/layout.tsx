// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import TawkTo from "./components/TawkTo";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Penta Stocks",
//   description: "All Trading Made Possible",
  
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html className="blvck" lang="en">
//       <head>
//       <meta property="og:title" content="https://www.financialprofessionals.org/images/default-source/article-images/bonds-vs-stocks.jpg?sfvrsn=8b80fd6b_0" />

//       </head>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
    
//         {children}
//         <div className='absolute bottom-0 right-0'>
//      <TawkTo />
//      </div>
//       </body>
//     </html>
//   );
// }


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
  openGraph: {
    title: "Penta Stocks",
    description: "All Trading Made Possible",
    url: "https://www.pentastocks.com", // Replace with your website's URL
    type: "website",
    images: [
      {
        url: "https://www.financialprofessionals.org/images/default-source/article-images/bonds-vs-stocks.jpg?sfvrsn=8b80fd6b_0", // Path to your image in the `public` folder or an absolute URL
        width: 1200,
        height: 630,
        alt: "Penta Stocks Preview Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Penta Stocks",
    description: "All Trading Made Possible",
    images: ["/images/preview-image.jpg"], // Twitter-specific image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="blvck" lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <div className="absolute bottom-0 right-0">
          <TawkTo />
        </div>
      </body>
    </html>
  );
}