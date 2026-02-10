// ============ مشترک ============
export type Location = {
  name: string;
  geographicallocation: [number, number];
};

// Turn برای Concert, Show, Sport
export type Turn = {
  clock: string;
  halls: string;
  price: number[];
  category: string[];
  sold_seats?: number;
  turnnumbre: number;
  available_seats?: number;
};

// ============ Concert ============
export type ConcertData = {
  id: string;
  turn: Turn[];
  category: string;
  duration: string;
  location: Location;
  venue_id: string;
  namesinger: string;
  ratesinger: number;
  dataconcert: string;
  description: string;
  imagesinger: string[];
  ageRestriction: string;
};

export type Concert = {
  id: string;
  concert_id: string;
  data: ConcertData;
  created_at: string;
};

export type Concerts = Concert[];

// ============ Show ============
export type ShowData = {
  id: string;
  turn: Turn[];
  category: string;
  duration: string;
  location: Location;
  venue_id: string;
  nameshow: string;
  datashow: string;
  description: string;
  imageshow: string[];
  ageRestriction: string;
  // اختیاری
  director?: string;
  composer?: string;
  creator?: string;
  creators?: string;
  performer?: string;
  performers?: string;
};

export type Show = {
  id: string;
  show_id: string;
  data: ShowData;
  created_at: string;
};

export type Shows = Show[];

// ============ Sport ============
export type Teams = {
  home: string;
  away: string;
};

export type Players = {
  player1: string;
  player2: string;
};

export type Fighters = {
  fighter1: string;
  fighter2: string;
};

export type SportData = {
  id: string;
  turn: Turn[];
  category: string;
  duration: string;
  location: Location;
  venue_id: string;
  namesport: string;
  datasport: string;
  description: string;
  imagesport: string[];
  ageRestriction: string;
  // اختیاری - بسته به نوع ورزش
  teams?: Teams;
  players?: Players;
  fighters?: Fighters;
};

export type Sport = {
  id: string;
  sport_id: string;
  data: SportData;
  created_at: string;
};

export type Sports = Sport[];

// ============ Festival ============
export type FestivalData = {
  id: string;
  turn: Turn[];
  category: string;
  location: Location;
  namefestival: string;
  dataconcert: string; // توی دیتا اینطوری هست
  imagefestival: string[];
  description: string;
};

export type Festival = {
  id: string;
  festival_id: string;
  data: FestivalData;
  created_at: string;
};

export type Festivals = Festival[];

// ============ Union Type ============
export type Event = Concert | Show | Sport | Festival;
export type Events = Event[];

// ************ HelpreFunction *************

// ============ Helper Types ============
export type EventData = ConcertData | ShowData | SportData | FestivalData;

export type EventType = "concerts" | "shows" | "sports" | "festivals";

// ============ Type Guards ============
export function isConcertData(data: EventData): data is ConcertData {
  return "imagesinger" in data;
}

export function isShowData(data: EventData): data is ShowData {
  return "imageshow" in data;
}

export function isSportData(data: EventData): data is SportData {
  return "imagesport" in data;
}

export function isFestivalData(data: EventData): data is FestivalData {
  return "imagefestival" in data;
}

// ============ Helper Functions ============
export function getEventImage(data: EventData): Array<string> {
  if (isConcertData(data)) return data.imagesinger;
  if (isShowData(data)) return data.imageshow;
  if (isSportData(data)) return data.imagesport;
  if (isFestivalData(data)) return data.imagefestival;
  return [""];
}

export function getEventName(data: EventData): string {
  if (isConcertData(data)) return data.namesinger;
  if (isShowData(data)) return data.nameshow;
  if (isSportData(data)) return data.namesport;
  if (isFestivalData(data)) return data.namefestival;
  return "";
}

export function getEventDate(data: EventData): string {
  if (isConcertData(data)) return data.dataconcert;
  if (isShowData(data)) return data.datashow;
  if (isSportData(data)) return data.datasport;
  if (isFestivalData(data)) return data.dataconcert; // festival هم dataconcert داره
  return "";
}

export function getEventImages(data: EventData): string[] {
  if (isConcertData(data)) return data.imagesinger;
  if (isShowData(data)) return data.imageshow;
  if (isSportData(data)) return data.imagesport;
  if (isFestivalData(data)) return data.imagefestival;
  return [];
}

// {
// // ============ Stage Types ============
// export type StageShape = "curved" | "rectangle" | "semicircle" | "circle";

// export interface Stage {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   shape: StageShape;
// }

// // ============ Court Types ============
// export interface Court {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
// }

// // ============ Seat Types ============
// export interface Seat {
//   id: string;
//   x: number;
//   y: number;
//   row: string;
//   number: number;
// }

// // ============ Section Types ============
// export interface Section {
//   id: string;
//   name: string;
//   color: string;
//   price: number;
//   seats: Seat[];
// }

// // ============ Raw Venue (از Supabase) ============
// export interface VenueRaw {
//   idx: number;
//   id: string;
//   name: string;
//   name_hall: string;
//   city: string;
//   width: number;
//   height: number;
//   stage: string | null; // JSON string یا null
//   court: string | null; // JSON string یا null
//   sections: string; // JSON string
//   created_at: string;
// }

// // ============ Parsed Venue ============
// export interface Venue {
//   idx: number;
//   id: string;
//   name: string;
//   nameHall: string;
//   city: string;
//   width: number;
//   height: number;
//   stage: Stage | null;
//   court: Court | null;
//   sections: Section[];
//   createdAt: Date;
// }

// // ============ Parse Function ============
// export function parseVenue(raw: VenueRaw): Venue {
//   return {
//     idx: raw.idx,
//     id: raw.id,
//     name: raw.name,
//     nameHall: raw.name_hall,
//     city: raw.city,
//     width: raw.width,
//     height: raw.height,
//     stage: raw.stage ? JSON.parse(raw.stage) : null,
//     court: raw.court ? JSON.parse(raw.court) : null,
//     sections: JSON.parse(raw.sections),
//     createdAt: new Date(raw.created_at),
//   };
// }

// // ============ Type Guards ============
// export function hasStage(venue: Venue): venue is Venue & { stage: Stage } {
//   return venue.stage !== null;
// }

// export function hasCourt(venue: Venue): venue is Venue & { court: Court } {
//   return venue.court !== null;
// }

// // ============ Utility Types ============
// export type VenueType = "concert" | "sport";

// export function getVenueType(venue: Venue): VenueType {
//   return venue.court ? "sport" : "concert";
// }

// // ========= Type Venues ===========
// }

export interface stage {
  x: number;
  y: number;
  shape: string;
  width: number;
  height: number;
}

export interface court {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface sections {
  id: string;
  name: string;
  color: string;
  price: number;
  seats: Array<{
    x: number;
    y: number;
    id: string;
    row: string;
    number: number;
  }>;
}

export interface Venues {
  idx: number;
  id: string;
  name: string;
  name_hall: string;
  city: string;
  width: number;
  height: number;
  stage: stage | null;
  court: court | null;
  sections: sections[];
  created_at: string;
}

// ***************** user Profile **********
export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  updated_at: string;
  phone: string | null;
  address: string | null;
  national_id: string | null;
  birth_date: string | null;
  gender: "male" | "female" | "other" | null;
  city: string | null;
}
