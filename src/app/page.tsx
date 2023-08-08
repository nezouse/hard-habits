import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div>
      <h1>wagmi + Next.js</h1>
      <Button>Click me</Button>
      <div className="grid grid-cols-2 gap-4 max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle> Public pool</CardTitle>
            <CardDescription>
              Share your achievements with everyone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>Some image</div>
          </CardContent>
          <CardFooter>
            <Button>Join pool</Button>
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
            <div>Some image</div>
          </CardContent>
          <CardFooter>
            <Button>Create pool</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
