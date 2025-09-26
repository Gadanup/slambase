import { Database } from "./database.types";

// Database table types
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Inserts<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type Updates<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// Specific entity types for easy use
export type Promotion = Tables<"promotions">;
export type Wrestler = Tables<"wrestlers">;
export type Championship = Tables<"championships">;
export type TitleReign = Tables<"title_reigns">;
export type Event = Tables<"events">;
export type Match = Tables<"matches">;
export type MatchParticipant = Tables<"match_participants">;
export type Feud = Tables<"feuds">;
export type FeudParticipant = Tables<"feud_participants">;
export type AdminUser = Tables<"admin_users">;

// Insert types (for creating new records)
export type PromotionInsert = Inserts<"promotions">;
export type WrestlerInsert = Inserts<"wrestlers">;
export type ChampionshipInsert = Inserts<"championships">;
export type TitleReignInsert = Inserts<"title_reigns">;
export type EventInsert = Inserts<"events">;
export type MatchInsert = Inserts<"matches">;
export type MatchParticipantInsert = Inserts<"match_participants">;
export type FeudInsert = Inserts<"feuds">;
export type FeudParticipantInsert = Inserts<"feud_participants">;

// Update types (for updating records)
export type PromotionUpdate = Updates<"promotions">;
export type WrestlerUpdate = Updates<"wrestlers">;
export type ChampionshipUpdate = Updates<"championships">;
export type TitleReignUpdate = Updates<"title_reigns">;
export type EventUpdate = Updates<"events">;
export type MatchUpdate = Updates<"matches">;
export type MatchParticipantUpdate = Updates<"match_participants">;
export type FeudUpdate = Updates<"feuds">;
export type FeudParticipantUpdate = Updates<"feud_participants">;

// Extended types with relations (for queries with joins)
export type WrestlerWithPromotion = Wrestler & {
  promotion: Promotion | null;
};

export type ChampionshipWithChampion = Championship & {
  current_champion: Wrestler | null;
  promotion: Promotion | null;
};

export type TitleReignWithDetails = TitleReign & {
  wrestler: Wrestler;
  championship: Championship;
};

export type EventWithMatches = Event & {
  matches: Match[];
  promotion: Promotion | null;
};

export type MatchWithDetails = Match & {
  event: Event;
  championship: Championship | null;
  winner: Wrestler | null;
  match_participants: (MatchParticipant & {
    wrestler: Wrestler;
  })[];
};

export type FeudWithParticipants = Feud & {
  promotion: Promotion | null;
  feud_participants: (FeudParticipant & {
    wrestler: Wrestler;
  })[];
};

// Enums (from CHECK constraints)
export type WrestlerStatus = "active" | "retired" | "released" | "injured";
export type ChampionshipTier =
  | "world"
  | "secondary"
  | "tag"
  | "women"
  | "cruiserweight"
  | "midcard";
export type EventType = "ppv" | "tv" | "house_show" | "special";
export type FeudStatus = "active" | "ended";
export type FeudRole = "face" | "heel" | "neutral";
export type AdminRole = "super_admin" | "editor";
