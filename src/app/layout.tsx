import { ConnectButton } from "@rainbow-me/rainbowkit";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Providers } from "./providers";
import Link from "next/link";

export const metadata = {
  title: "Hard habits",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="p-4">
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}

function Nav() {
  return (
    <nav className="flex justify-between mb-4">
      <div>
        <Link href="/">💪 Hard habits</Link>
      </div>
      <ConnectButton />
    </nav>
  );
}
