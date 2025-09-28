import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function WrestlerNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="bg-dark-900 border-dark-800 max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <CardTitle>Wrestler Not Found</CardTitle>
          </div>
          <CardDescription>
            The wrestler you're looking for doesn't exist or has been deleted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/admin/wrestlers">
            <Button className="w-full bg-primary-600 hover:bg-primary-700">
              Back to Wrestlers
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
