import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

import PrivatePool from "@/images/privatePool.png";
import PublicPool from "@/images/publicPool.png";
import { BanknoteIcon, BarChartIcon } from "lucide-react";

export default function Page() {
  return (
    <div>
      <Header />
      <div className="grid-cols-1 grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
        <Card id="publicPool">
          <CardHeader>
            <CardTitle> Public pool</CardTitle>
            <CardDescription>
              Share your achievements with everyone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Image
              src={PublicPool}
              height={320}
              alt="A group of people sitting together."
              className="mx-auto"
            />
          </CardContent>
          <CardFooter>
            <Button asChild className="mx-auto w-40">
              <Link href="/publicPool/create">Join pool</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Private pool</CardTitle>
            <CardDescription>
              Compete with your friends and family
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Image
              src={PrivatePool}
              height={320}
              alt="A girl sitting alone."
              className="mx-auto"
            />
          </CardContent>
          <CardFooter>
            <Button className="mx-auto w-40" disabled>
              Create pool
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export const Header = () => {
  return (
    <div className="mb-16">
      <div className="bg-blue-50">
        <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
          <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
            <div>
              <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
                Fully permissionless
              </p>
            </div>
            <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
              <span className="relative inline-block">
                <svg
                  viewBox="0 0 52 24"
                  fill="currentColor"
                  className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-gray-400 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
                >
                  <defs>
                    <pattern
                      id="dc223fcc-6d72-4ebc-b4ef-abe121034d6e"
                      x="0"
                      y="0"
                      width=".135"
                      height=".30"
                    >
                      <circle cx="1" cy="1" r=".7" />
                    </pattern>
                  </defs>
                  <rect
                    fill="url(#dc223fcc-6d72-4ebc-b4ef-abe121034d6e)"
                    width="52"
                    height="24"
                  />
                </svg>
                <span className="relative">The</span>
              </span>{" "}
              easiest way to keep your streak going
            </h2>
            <p className="text-base text-gray-700 md:text-lg">
              Get better every day without leaving money on the table.
            </p>
            <p className="text-base text-gray-700 md:text-lg">
              All free, all yours.
            </p>
          </div>
          <div className="flex items-center sm:justify-center">
            <Button
              asChild
              className="inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-primary hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
            >
              <a href="#publicPool">Get started</a>
            </Button>
            <a
              href="https://github.com/nezouse/hard-habits"
              target="_blank"
              className="inline-flex items-center font-semibold text-gray-800 transition-colors duration-200 hover:text-deep-purple-accent-700"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
      <div className="relative px-4 sm:px-0">
        <div className="absolute inset-0 bg-blue-50 h-1/2" />
        <div className="absolute bottom-[-160px] left-0 right-0 bg-blue-100 h-60 -z-10" />
        <div className="relative grid mx-auto overflow-hidden bg-white divide-y rounded shadow sm:divide-y-0 sm:divide-x sm:max-w-screen-sm sm:grid-cols-3 lg:max-w-screen-md">
          <div className="inline-block p-8 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-indigo-50">
              <BarChartIcon className="text-blue-500" />
            </div>
            <p className="font-bold tracking-wide text-gray-800">
              Make yourself better
            </p>
          </div>
          <div className="inline-block p-8 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-indigo-50">
              <svg
                className="w-10 h-10 text-blue-500"
                stroke="currentColor"
                viewBox="0 0 52 52"
              >
                <polygon
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  points="29 13 14 29 25 29 23 39 38 23 27 23"
                />
              </svg>
            </div>
            <p className="font-bold tracking-wide text-gray-800">
              Compete with others
            </p>
          </div>
          <div className="inline-block p-8 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-indigo-50">
              <BanknoteIcon className="text-blue-500" />
            </div>
            <p className="font-bold tracking-wide text-gray-800">
              While earning money
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
