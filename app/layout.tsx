import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import "./globals.css";

const roboto = Oswald({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PUBG HUD",
  description: "ESN",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className="dark">
      <body className={`${roboto.className} antialiased`}>{children}</body>
    </html>
  );
};

export default RootLayout;
