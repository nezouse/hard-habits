import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@uploadthing/react/styles.css";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { GithubIcon } from "lucide-react";

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
      <body className="min-h-screen">
        <Providers>
          <Nav />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

function Nav() {
  return (
    <nav className="flex justify-between mb-12 mx-6 mt-5">
      <div>
        <Button variant="link" asChild className="text-2xl text-yellow-950">
          <Link href="/">💪 Hard habits</Link>
        </Button>
        <Button variant="link" asChild className="text-yellow-950">
          <Link href="/feed">Feed</Link>
        </Button>

        <ProfileLink />
      </div>
      <ConnectButton />
    </nav>
  );
}

export const Footer = () => {
  return (
    <div className="relative mt-48 bg-blue-200 text-blue-950">
      <svg
        className="absolute top-0 w-full h-6 -mt-5 sm:-mt-10 sm:h-16 text-blue-200"
        preserveAspectRatio="none"
        viewBox="0 0 1440 54"
      >
        <path
          fill="currentColor"
          d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"
        />
      </svg>
      <div className="px-4 pt-12 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
        <div className="grid gap-16 row-gap-10 mb-8 lg:grid-cols-6">
          <div className="md:max-w-md lg:col-span-2">
            <div className="mt-4 lg:max-w-sm">
              <p className="text-sm">
                Lets try to get the best of us. Keep track of your habits and be
                the best version of yourself.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between pt-5 pb-10 border-t border-deep-purple-accent-200 sm:flex-row">
          <p className="text-sm ">2023, Hard habits. All the fun for you.</p>
          <div className="flex items-center mt-4 space-x-4 sm:mt-0">
            <a
              href="https://github.com/nezouse/hard-habits"
              target="_blank"
              className="transition-colors duration-300 hover:text-blue-400"
            >
              <GithubIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
