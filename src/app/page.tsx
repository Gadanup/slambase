import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-dark">
      <div className="text-center mb-8">
        <h1 className="font-display text-display-xl text-primary-500 mb-2">
          SlamBase
        </h1>
        <p className="text-dark-400 text-xl">Your Wrestling Database</p>
      </div>

      <Card className="bg-dark-900 border-dark-800 w-full max-w-md card-hover">
        <CardHeader>
          <CardTitle className="text-primary-500">
            Welcome to SlamBase
          </CardTitle>
          <CardDescription>
            The ultimate wrestling database featuring comprehensive profiles,
            title histories, and event coverage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Badge className="bg-primary-500">Wrestlers</Badge>
            <Badge className="bg-secondary-500 text-dark-950">
              Championships
            </Badge>
            <Badge className="bg-dark-700">Events</Badge>
            <Badge className="bg-dark-700">Feuds</Badge>
          </div>
          <Button className="w-full bg-primary-600 hover:bg-primary-700">
            Explore Database
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
