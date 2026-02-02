import { supabase } from "./supabase";
import {
  Concerts,
  Shows,
  Sports,
  Festivals,
  Concert,
  Show,
  Festival,
  Sport,
  Events,
  Venues,
} from "./types/event";

// ************* Festival *********
export async function getFestivals(): Promise<Festivals> {
  const { data, error } = await supabase
    .from("festivals")
    .select("*")
    .order("data->dataconcert", { ascending: true });

  if (error) {
    console.error("Error fetching festivals:", error);
    return [];
  }

  return data.map((row) => row);
}

// ************* Concert *******************
export async function getConcerts(): Promise<Concerts> {
  const { data, error } = await supabase.from("concerts").select("*");
  // .order("data->dataconcert", { ascending: true });
  if (error) {
    console.error("Error fetching concerts:", error);
    return [];
  }

  return data.map((row) => row);
}

// ************ Show **************
export async function getShows(): Promise<Shows> {
  const { data, error } = await supabase
    .from("shows")
    .select("*")
    .order("data->datashow", { ascending: true });

  if (error) {
    console.error("Error fetching shows:", error);
    return [];
  }

  return data.map((row) => row);
}

// *************** Sport ************
export async function getSports(): Promise<Sports> {
  const { data, error } = await supabase
    .from("sports")
    .select("*")
    .order("data->datasport", { ascending: true });

  if (error) {
    console.error("Error fetching sports:", error);
    return [];
  }

  return data.map((row) => row);
}

export async function getVenuesByID(venues: string): Promise<Venues> {
  const { data, error } = await supabase
    .from("venues")
    .select("*")
    .eq("id_hall", venues)
    .single();

  if (error) {
    console.error("Error fetching venues:", error);
    // return []
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
    console.error("Error fetching EventSeats:", error);
    return [];
  }

  return data;
}
export async function getAllEventSeats() {
  const { data, error } = await supabase.from("event_seats").select("*");

  if (error) {
    console.error("Error fetching AllEventSeats:", error);
    return [];
  }

  return data;
}

export async function getCustomEvent(nameEvent: string) {
  const { data, error } = await supabase.from(nameEvent).select("*");

  if (error) {
    console.error("Error fetching Your Event:", error);
    return [];
  }

  return data.map((row) => row);
}

//! *********** Get All Data with ID *************

export async function getItemById(
  concertId: string,
  dataName: string,
): Promise<Concert | Show | Festival | Sport> {
  const { data, error } = await supabase
    .from(`${dataName}s`)
    .select("*")
    .eq(`${dataName}_id`, concertId)
    .single();

  if (error) {
    console.error("Error fetching Tikets By ID:", error);
  }

  return data;
}

export async function getAllDataByNameTable(
  category: string,
  name: string,
  idPerform?: string,
): Promise<Events> {
  let query = supabase
    .from(name)
    .select("*")
    .order("data->dataconcert", { ascending: true });

  if (category !== "All") {
    query = query.eq("data->>category", category).limit(4);
  }

  if (idPerform) {
    query = query.neq("data->>id", idPerform);
  }

  query = query.limit(4);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching concerts:", error);
    return [];
  }

  return data.map((row) => row);
}
