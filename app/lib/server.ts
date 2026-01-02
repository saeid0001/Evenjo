import { supabase } from "./supabase";

export async function getFestivals() {
  const { data, error } = await supabase.from("festivals").select("*");

  if (error) {
    console.error("Error fetching festivals:", error);
    return [];
  }

  return data.map((row) => row);
}

export async function getConcerts() {
  const { data, error } = await supabase.from("concerts").select("*");

  if (error) {
    console.error("Error fetching concerts:", error);
    return [];
  }

  return data.map((row) => row);
}
export async function getConcertsById(concertId: string) {
  const { data, error } = await supabase
    .from("concerts")
    .select("*")
    .eq("concert_id", concertId)
    .single();

  if (error) {
    console.error("Error fetching concerts:", error);
    return [];
  }

  return data;
}

export async function getShows() {
  const { data, error } = await supabase.from("shows").select("*");

  if (error) {
    console.error("Error fetching shows:", error);
    return [];
  }

  return data.map((row) => row);
}

export async function getSports() {
  const { data, error } = await supabase.from("sports").select("*");

  if (error) {
    console.error("Error fetching sports:", error);
    return [];
  }

  return data.map((row) => row);
}

export async function getVenuesByID(venues: string) {
  const { data, error } = await supabase
    .from("venues")
    .select("*")
    .eq("id", venues)
    .single();

  if (error) {
    console.error("Error fetching venues:", error);
    return [];
  }

  return data;
}
export async function getEventSeats(concertID: string, turnNumber: number) {
  const { data, error } = await supabase
    .from("event_seats")
    .select("*")
    .eq("event_id", concertID)
    .eq("turn_number", turnNumber);

  if (error) {
    console.error("Error fetching venues:", error);
    return [];
  }

  return data;
}
export async function getAllEventSeats() {
  const { data, error } = await supabase.from("event_seats").select("*");

  if (error) {
    console.error("Error fetching venues:", error);
    return [];
  }

  return data;
}
