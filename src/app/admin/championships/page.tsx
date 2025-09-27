import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy } from "lucide-react";

export default function ChampionshipsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-display-md text-secondary-500 mb-2">
          Championships
        </h1>
        <p className="text-dark-400">Manage titles and championship history</p>
      </div>

      <Card className="bg-dark-900 border-dark-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-secondary-500" />
            Championship Management
          </CardTitle>
          <CardDescription>
            Create titles and track championship reigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-dark-400">Coming soon in the next steps...</p>
        </CardContent>
      </Card>
    </div>
  );
}
