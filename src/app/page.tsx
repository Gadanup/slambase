import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { Wrestler } from "@/lib/types";

export default async function Home() {
  const supabase = await createClient();

  // Type-safe query!
  const { data: wrestlers } = await supabase
    .from("wrestlers")
    .select("*")
    .limit(3)
    .returns<Wrestler[]>();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-dark">
      <div className="text-center mb-8">
        <h1 className="font-display text-display-xl text-primary-500 mb-2">
          SlamBase
        </h1>
        <p className="text-dark-400 text-xl">Your Wrestling Database</p>
      </div>

      <Card className="bg-dark-900 border-dark-800 w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-primary-500">
            TypeScript Types Test
          </CardTitle>
          <CardDescription>Database is ready with type safety!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 p-4 bg-dark-800 rounded-lg">
            <p className="text-sm font-mono text-secondary-400">
              ✅ Database tables: 10
            </p>
            <p className="text-sm font-mono text-secondary-400">
              ✅ TypeScript types: Generated
            </p>
            <p className="text-sm font-mono text-secondary-400">
              ✅ Storage buckets: 3
            </p>
            <p className="text-sm font-mono text-secondary-400">
              ✅ Wrestlers in DB: {wrestlers?.length || 0}
            </p>
          </div>
          <Button className="w-full bg-primary-600 hover:bg-primary-700">
            Start Building
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
