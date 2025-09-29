import { createClient } from "@/lib/supabase/server";
import { DeleteWrestlerDialog } from "@/components/admin/DeleteWrestlerDialog";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Award,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { format } from "date-fns";

interface WrestlerViewPageProps {
  params: {
    id: string;
  };
}

export default async function WrestlerViewPage({
  params,
}: WrestlerViewPageProps) {
  const supabase = await createClient();

  // Fetch the wrestler with promotion
  const { data: wrestler, error } = await supabase
    .from("wrestlers")
    .select(
      `
      *,
      promotion:promotions(id, name, abbreviation, logo_url)
    `
    )
    .eq("id", params.id)
    .single();

  if (error || !wrestler) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600 text-white";
      case "retired":
        return "bg-gray-600 text-white";
      case "injured":
        return "bg-yellow-600 text-black";
      case "released":
        return "bg-red-600 text-white";
      default:
        return "bg-dark-600 text-white";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/wrestlers">
            <Button variant="ghost" size="sm" className="cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Wrestlers
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-display-md text-primary-500">
              {wrestler.ring_name || wrestler.name}
            </h1>
            {wrestler.ring_name && (
              <p className="text-dark-400">Real name: {wrestler.name}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link href={`/admin/wrestlers/${wrestler.id}/edit`}>
            <Button className="bg-primary-600 hover:bg-primary-700 cursor-pointer">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <DeleteWrestlerDialog
            wrestler={wrestler}
            redirectAfterDelete={true}
            trigger={
              <Button variant="destructive" className="cursor-pointer">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image & Basic Info */}
        <div className="space-y-6">
          {/* Wrestler Image */}
          <Card className="bg-dark-900 border-dark-800">
            <CardContent className="p-6">
              <div className="aspect-[3/4] w-full bg-dark-800 rounded-lg overflow-hidden">
                {wrestler.image_url ? (
                  <img
                    src={wrestler.image_url}
                    alt={wrestler.ring_name || wrestler.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-dark-500">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-dark-700 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-2xl font-display">
                          {(wrestler.ring_name || wrestler.name).charAt(0)}
                        </span>
                      </div>
                      <p className="text-sm">No image</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status & Promotion */}
          <Card className="bg-dark-900 border-dark-800">
            <CardHeader>
              <CardTitle className="text-lg text-primary-400">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Badge className={getStatusColor(wrestler.status)} size="lg">
                  {wrestler.status.charAt(0).toUpperCase() +
                    wrestler.status.slice(1)}
                </Badge>
              </div>

              {wrestler.promotion && (
                <div>
                  <p className="text-sm text-dark-400 mb-2">Promotion</p>
                  <Badge
                    variant="outline"
                    className="text-secondary-500 border-secondary-500"
                    size="lg"
                  >
                    {wrestler.promotion.name}
                  </Badge>
                </div>
              )}

              {wrestler.brand && (
                <div>
                  <p className="text-sm text-dark-400 mb-2">Brand</p>
                  <Badge
                    variant="outline"
                    className="border-primary-500 text-primary-400"
                  >
                    {wrestler.brand}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="bg-dark-900 border-dark-800">
            <CardHeader>
              <CardTitle className="text-xl text-primary-400 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-dark-400 mb-1">Full Name</p>
                  <p className="text-dark-100 font-medium">{wrestler.name}</p>
                </div>

                {wrestler.ring_name && (
                  <div>
                    <p className="text-sm text-dark-400 mb-1">Ring Name</p>
                    <p className="text-dark-100 font-medium">
                      {wrestler.ring_name}
                    </p>
                  </div>
                )}

                {wrestler.birthplace && (
                  <div>
                    <p className="text-sm text-dark-400 mb-1">Birthplace</p>
                    <p className="text-dark-100">{wrestler.birthplace}</p>
                  </div>
                )}

                {wrestler.birth_date && (
                  <div>
                    <p className="text-sm text-dark-400 mb-1">Birth Date</p>
                    <p className="text-dark-100 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(wrestler.birth_date)}
                    </p>
                  </div>
                )}

                {wrestler.debut_date && (
                  <div>
                    <p className="text-sm text-dark-400 mb-1">Debut Date</p>
                    <p className="text-dark-100 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(wrestler.debut_date)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Physical Stats */}
          <Card className="bg-dark-900 border-dark-800">
            <CardHeader>
              <CardTitle className="text-xl text-primary-400 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Physical Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {wrestler.height && (
                  <div>
                    <p className="text-sm text-dark-400 mb-1">Height</p>
                    <p className="text-dark-100 font-medium">
                      {wrestler.height}
                    </p>
                  </div>
                )}

                {wrestler.weight && (
                  <div>
                    <p className="text-sm text-dark-400 mb-1">Weight</p>
                    <p className="text-dark-100 font-medium">
                      {wrestler.weight}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Wrestling Moves */}
          <Card className="bg-dark-900 border-dark-800">
            <CardHeader>
              <CardTitle className="text-xl text-primary-400 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Signature Moves
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {wrestler.finishing_move && (
                  <div>
                    <p className="text-sm text-dark-400 mb-1">Finishing Move</p>
                    <Badge
                      variant="outline"
                      className="border-primary-500 text-primary-400"
                    >
                      {wrestler.finishing_move}
                    </Badge>
                  </div>
                )}

                {wrestler.signature_move && (
                  <div>
                    <p className="text-sm text-dark-400 mb-1">Signature Move</p>
                    <Badge
                      variant="outline"
                      className="border-secondary-500 text-secondary-400"
                    >
                      {wrestler.signature_move}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Biography */}
          {wrestler.bio && (
            <Card className="bg-dark-900 border-dark-800">
              <CardHeader>
                <CardTitle className="text-xl text-primary-400">
                  Biography
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-dark-200 leading-relaxed whitespace-pre-wrap">
                  {wrestler.bio}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
