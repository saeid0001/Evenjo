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
import { SeatType } from "./useSeatStor";

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
export async function getAllEventSeatsByUserId(
  userId: string,
  statusSeat?: string,
): Promise<SeatType[]> {
  let query = supabase.from("event_seats").select("*");
  if (statusSeat) {
    query = query.eq("status", statusSeat);
  }
  const { data, error } = await query.eq("user_id", userId);

  if (error) {
    console.error("Error fetching AllEventSeats:", error);
    return [];
  }

  return data;
}

export async function getCustomEvent(nameEvent: string, page?: number) {
  let query = supabase.from(nameEvent).select("*", { count: "exact" });

  if (page) {
    const ITEM_PRE_PAGE = 8;
    const from = (page - 1) * ITEM_PRE_PAGE;
    const to = from + ITEM_PRE_PAGE - 1;

    // const now = new Date();
    // const sevenDaysLater = new Date();
    // sevenDaysLater.setDate(now.getDate() + 7);

    // const formatDate = (date: Date) => {
    //   const y = date.getFullYear();
    //   const m = String(date.getMonth() + 1).padStart(2, "0");
    //   const d = String(date.getDate()).padStart(2, "0");
    //   return `${y}/${m}/${d}`;
    // };

    // const startDate = formatDate(now);
    // const endDate = formatDate(sevenDaysLater);

    query = query
      .select("*")
      .range(from, to)
      // .eq("data->location->>name", "las vegas sphere")
      // .gte("data->>dataconcert", startDate)
      // .lte("data->>dataconcert", endDate)
      .order("created_at", { ascending: false });
  } else {
    query = query.select("*");
  }

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching Your Event:", error);
    return [];
  }

  if (page) {
    return [data.map((row) => row), count];
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

export async function getDataByIdUserSeat(
  name: string,
  idPerform: string,
): Promise<Concert[] | Show[] | Festival[] | Sport[]> {
  const { data, error } = await supabase
    .from(`${name}s`)
    .select("*")
    .eq(`${name}_id`, `${name}_${idPerform}`);

  if (error) {
    console.error("Error fetching getDataByIdUserSeat:", error);
    return [];
  }

  return data.map((row) => row);
}
