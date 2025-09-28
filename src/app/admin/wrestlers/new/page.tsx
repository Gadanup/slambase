import { createClient } from "@/lib/supabase/server";
import { WrestlerForm } from "@/components/admin/WrestlerForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewWrestlerPage() {
  const supabase = await createClient();

  // Fetch promotions for the dropdown
  const { data: promotions } = await supabase
    .from("promotions")
    .select("*")
    .order("name");

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/wrestlers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-display-md text-primary-500">
            Add New Wrestler
          </h1>
          <p className="text-dark-400">Create a new wrestler profile</p>
        </div>
      </div>

      {/* Form */}
      <WrestlerForm promotions={promotions || []} />
    </div>
  );
}
