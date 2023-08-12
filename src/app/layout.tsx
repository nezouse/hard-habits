import { ConnectButton } from "@rainbow-me/rainbowkit";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Providers } from "./providers";
import Link from "next/link";
import { ProfileLink } from "@/components/ProfileLink";
import { Button } from "@/components/ui/button";

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
    <nav className="flex justify-between mb-12">
      <div>
        <Button variant="link" asChild className="text-2xl">
          <Link href="/">💪 Hard habits</Link>
        </Button>

        <ProfileLink />
      </div>
      <ConnectButton />
    </nav>
  );
}
