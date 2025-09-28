import { createClient } from "@/lib/supabase/server";
import { WrestlerForm } from "@/components/admin/WrestlerForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

interface EditWrestlerPageProps {
  params: {
    id: string;
  };
}

export default async function EditWrestlerPage({
  params,
}: EditWrestlerPageProps) {
  const supabase = await createClient();

  // Fetch the wrestler
  const { data: wrestler, error } = await supabase
    .from("wrestlers")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !wrestler) {
    notFound();
  }

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
          <Button className="cursor-pointer" variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-display-md text-primary-500">
            Edit Wrestler
          </h1>
          <p className="text-dark-400">
            Update {wrestler.ring_name || wrestler.name}'s profile
          </p>
        </div>
      </div>

      {/* Form */}
      <WrestlerForm wrestler={wrestler} promotions={promotions || []} />
    </div>
  );
}
