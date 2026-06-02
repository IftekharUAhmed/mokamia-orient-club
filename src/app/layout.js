import { Inter, Roboto } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto = Roboto({ weight: ['400', '500', '700'], subsets: ["latin"], variable: "--font-roboto" });

 export const metadata = {
  title: "Mokamia Orient Club | Est. 1985",
  description: "Fostering Brotherhood & Village Pride Since 1985. Join the pride of Mokamia for sports, social work, and lifelong community bonding.",
  openGraph: {
    title: "Mokamia Orient Club | Built on Brotherhood",
    description: "Fostering Brotherhood & Village Pride Since 1985. Join the pride of Mokamia for sports, social work, and lifelong community bonding.",
    url: "https://tor-website-url.com", // 🔴 pore ekhane tor ashol website er link dibi
    siteName: "Mokamia Orient Club",
    images: [
      {
        url: "/mpl-champ.jpeg", // eita FB te boro kore vese uthbe
        width: 1200,
        height: 630,
        alt: "Mokamia Orient Club Legacy",
      },
    ],
    locale: "en_US",
    type: "website",
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
