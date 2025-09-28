import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { WrestlersTable } from "@/components/admin/WrestlersTable";
import { Skeleton } from "@/components/ui/skeleton";

async function WrestlersContent() {
  const supabase = await createClient();

  // Fetch all wrestlers with their promotions
  const { data: wrestlers, error } = await supabase
    .from("wrestlers")
    .select(
      `
      *,
      promotion:promotions(id, name, abbreviation)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching wrestlers:", error);
  }

  return <WrestlersTable wrestlers={wrestlers || []} />;
}

function WrestlersLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export default function WrestlersPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-display-md text-primary-500 mb-2">
            Wrestlers
          </h1>
          <p className="text-dark-400">Manage your wrestling roster</p>
        </div>
        <Link href="/admin/wrestlers/new">
          <Button className="bg-primary-600 hover:bg-primary-700 cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            Add Wrestler
          </Button>
        </Link>
      </div>

      {/* Wrestlers Table */}
      <Suspense fallback={<WrestlersLoadingSkeleton />}>
        <WrestlersContent />
      </Suspense>
    </div>
  );
}
