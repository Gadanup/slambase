import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { Users, Trophy, Calendar, Swords } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Get admin user details
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!adminUser) {
    redirect("/admin/login");
  }

  // Get quick stats
  const [
    { count: wrestlersCount },
    { count: championshipsCount },
    { count: eventsCount },
    { count: feudsCount },
  ] = await Promise.all([
    supabase.from("wrestlers").select("*", { count: "exact", head: true }),
    supabase.from("championships").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("feuds").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div className="min-h-screen p-8 bg-gradient-dark">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-display text-display-lg text-primary-500 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-dark-400">
              Welcome back,{" "}
              <span className="text-secondary-400">{adminUser.email}</span>
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-dark-900 border-dark-800 card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-dark-300">
                Total Wrestlers
              </CardTitle>
              <Users className="h-4 w-4 text-primary-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary-500">
                {wrestlersCount || 0}
              </div>
              <p className="text-xs text-dark-400 mt-1">
                Active roster members
              </p>
            </CardContent>
          </Card>

          <Card className="bg-dark-900 border-dark-800 card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-dark-300">
                Championships
              </CardTitle>
              <Trophy className="h-4 w-4 text-secondary-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary-500">
                {championshipsCount || 0}
              </div>
              <p className="text-xs text-dark-400 mt-1">Active titles</p>
            </CardContent>
          </Card>

          <Card className="bg-dark-900 border-dark-800 card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-dark-300">
                Events
              </CardTitle>
              <Calendar className="h-4 w-4 text-primary-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary-500">
                {eventsCount || 0}
              </div>
              <p className="text-xs text-dark-400 mt-1">Total events</p>
            </CardContent>
          </Card>

          <Card className="bg-dark-900 border-dark-800 card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-dark-300">
                Active Feuds
              </CardTitle>
              <Swords className="h-4 w-4 text-secondary-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary-500">
                {feudsCount || 0}
              </div>
              <p className="text-xs text-dark-400 mt-1">Ongoing storylines</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-dark-900 border-dark-800">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="p-4 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors text-left">
                <Users className="h-6 w-6 text-primary-500 mb-2" />
                <p className="font-semibold text-dark-100">Add Wrestler</p>
                <p className="text-sm text-dark-400">Create new profile</p>
              </button>

              <button className="p-4 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors text-left">
                <Trophy className="h-6 w-6 text-secondary-500 mb-2" />
                <p className="font-semibold text-dark-100">Add Championship</p>
                <p className="text-sm text-dark-400">Create new title</p>
              </button>

              <button className="p-4 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors text-left">
                <Calendar className="h-6 w-6 text-primary-500 mb-2" />
                <p className="font-semibold text-dark-100">Add Event</p>
                <p className="text-sm text-dark-400">Schedule show</p>
              </button>

              <button className="p-4 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors text-left">
                <Swords className="h-6 w-6 text-secondary-500 mb-2" />
                <p className="font-semibold text-dark-100">Add Feud</p>
                <p className="text-sm text-dark-400">Create storyline</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
