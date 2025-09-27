import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Users, Trophy, Calendar, Swords } from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { QuickActions } from "@/components/admin/QuickActions";
import { DashboardSkeleton } from "@/components/admin/DashboardSkeleton";

async function DashboardContent() {
  const supabase = await createClient();

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

  // Get recent activity
  const { data: recentWrestlers } = await supabase
    .from("wrestlers")
    .select("id, name, ring_name, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentEvents } = await supabase
    .from("events")
    .select("id, name, event_date, event_type, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  // Quick actions configuration
  const quickActions = [
    {
      title: "Add Wrestler",
      description: "Create new profile",
      href: "/admin/wrestlers/new",
      icon: Users,
      colorScheme: "primary" as const,
    },
    {
      title: "Add Championship",
      description: "Create new title",
      href: "/admin/championships/new",
      icon: Trophy,
      colorScheme: "secondary" as const,
    },
    {
      title: "Add Event",
      description: "Schedule show",
      href: "/admin/events/new",
      icon: Calendar,
      colorScheme: "primary" as const,
    },
    {
      title: "Add Feud",
      description: "Create storyline",
      href: "/admin/feuds/new",
      icon: Swords,
      colorScheme: "secondary" as const,
    },
  ];

  // Format recent wrestlers
  const wrestlerActivity =
    recentWrestlers?.map((w) => ({
      id: w.id,
      title: w.ring_name || w.name,
      subtitle: `Added ${new Date(w.created_at).toLocaleDateString()}`,
      badge: { label: "New", variant: "outline" as const },
    })) || [];

  // Format recent events
  const eventActivity =
    recentEvents?.map((e) => ({
      id: e.id,
      title: e.name,
      subtitle: new Date(e.event_date).toLocaleDateString(),
      badge: { label: e.event_type, variant: "outline" as const },
    })) || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-display-md text-primary-500 mb-2">
          Dashboard
        </h1>
        <p className="text-dark-400">
          Welcome back! Here's what's happening with your wrestling database.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Wrestlers"
          value={wrestlersCount || 0}
          description="Active roster members"
          icon={Users}
          colorScheme="primary"
        />
        <StatsCard
          title="Championships"
          value={championshipsCount || 0}
          description="Active titles"
          icon={Trophy}
          colorScheme="secondary"
        />
        <StatsCard
          title="Events"
          value={eventsCount || 0}
          description="Total events"
          icon={Calendar}
          colorScheme="primary"
        />
        <StatsCard
          title="Active Feuds"
          value={feudsCount || 0}
          description="Ongoing storylines"
          icon={Swords}
          colorScheme="secondary"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions actions={quickActions} />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity
          title="Recent Wrestlers"
          description="Latest additions to the roster"
          items={wrestlerActivity}
          emptyMessage="No wrestlers yet"
          colorScheme="primary"
        />
        <RecentActivity
          title="Recent Events"
          description="Latest scheduled shows"
          items={eventActivity}
          emptyMessage="No events yet"
          colorScheme="secondary"
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
