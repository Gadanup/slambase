import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";

export default function WrestlersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-display-md text-primary-500 mb-2">
          Wrestlers
        </h1>
        <p className="text-dark-400">Manage your wrestling roster</p>
      </div>

      <Card className="bg-dark-900 border-dark-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary-500" />
            Wrestler Management
          </CardTitle>
          <CardDescription>
            Create, edit, and manage wrestler profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-dark-400">Coming soon in the next steps...</p>
        </CardContent>
      </Card>
    </div>
  );
}
