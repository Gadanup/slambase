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

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* Theme Demo Card 1 */}
        <Card className="bg-dark-900 border-dark-800 card-hover">
          <CardHeader>
            <CardTitle className="text-primary-500">
              Primary Red Theme
            </CardTitle>
            <CardDescription>Wrestling energy and passion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-primary-600 hover:bg-primary-700">
              Primary Button
            </Button>
            <Badge className="bg-primary-500">Active Wrestler</Badge>
          </CardContent>
        </Card>

        {/* Theme Demo Card 2 */}
        <Card className="bg-dark-900 border-dark-800 card-hover">
          <CardHeader>
            <CardTitle className="text-secondary-500">
              Championship Gold
            </CardTitle>
            <CardDescription>Title prestige and glory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-gradient-gold hover:opacity-90">
              Gold Button
            </Button>
            <span className="championship-badge">World Champion</span>
          </CardContent>
        </Card>

        {/* Typography Demo */}
        <Card className="bg-dark-900 border-dark-800 md:col-span-2">
          <CardHeader>
            <CardTitle>Typography Scale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-dark-400 mb-1">
                Display XL (Wrestler Names)
              </p>
              <h1 className="font-display text-display-xl text-primary-500">
                John Cena
              </h1>
            </div>
            <div>
              <p className="text-sm text-dark-400 mb-1">
                Display LG (Event Titles)
              </p>
              <h2 className="font-display text-display-lg text-secondary-500">
                WrestleMania
              </h2>
            </div>
            <div>
              <p className="text-sm text-dark-400 mb-1">
                Display MD (Section Headers)
              </p>
              <h3 className="font-display text-display-md">Championships</h3>
            </div>
            <div>
              <p className="text-sm text-dark-400 mb-1">Body Text (Inter)</p>
              <p className="text-dark-300">
                The ultimate wrestling database featuring comprehensive
                profiles, title histories, and event coverage.
              </p>
            </div>
            <div>
              <p className="text-sm text-dark-400 mb-1">Monospace (Stats)</p>
              <p className="font-mono text-secondary-400">
                Debut: 2025-01-15 | Height: 6'1" | Weight: 251 lbs
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
