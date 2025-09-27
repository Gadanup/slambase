import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-display-md text-primary-500 mb-2">
          Events
        </h1>
        <p className="text-dark-400">Schedule and manage wrestling events</p>
      </div>

      <Card className="bg-dark-900 border-dark-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary-500" />
            Event Management
          </CardTitle>
          <CardDescription>Create events and build match cards</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-dark-400">Coming soon in the next steps...</p>
        </CardContent>
      </Card>
    </div>
  );
}
