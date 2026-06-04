import { Inter, Roboto } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto = Roboto({ weight: ['400', '500', '700'], subsets: ["latin"], variable: "--font-roboto" });

  export const viewport = {
  themeColor: '#2B3674',
};

export const metadata = {
  title: 'Mokamia Orient Club',
  description: 'Official Portal of MOC - Est. 1985',
  manifest: '/manifest.json', // Eita tor app-er magic file
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MOC',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${roboto.variable} font-sans bg-[#F3F4F6]`}>
        {children}
      </body>
    </html>
  );
}
