import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Swords } from "lucide-react";

export default function FeudsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-display-md text-secondary-500 mb-2">
          Feuds
        </h1>
        <p className="text-dark-400">Create and manage wrestling storylines</p>
      </div>

      <Card className="bg-dark-900 border-dark-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Swords className="h-5 w-5 text-secondary-500" />
            Feud Management
          </CardTitle>
          <CardDescription>
            Track rivalries and storyline progression
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-dark-400">Coming soon in the next steps...</p>
        </CardContent>
      </Card>
    </div>
  );
}
