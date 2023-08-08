import { ConnectButton } from "@rainbow-me/rainbowkit";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Providers } from "./providers";
import Link from "next/link";

export const metadata = {
  title: "wagmi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
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
    <nav className="flex justify-between">
      <div>
        <Link href="/">Hard habits</Link>
      </div>
      <ConnectButton />
    </nav>
  );
}
