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

export default function Page() {
  return (
    <div className="grid-cols-1 grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
      <Card>
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
  );
}
