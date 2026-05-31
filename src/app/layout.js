import { Inter, Roboto } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto = Roboto({ weight: ['400', '500', '700'], subsets: ["latin"], variable: "--font-roboto" });

export const metadata = {
  title: "MOC Portal",
  description: "Official portal for Mokamia Orient Club",
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
