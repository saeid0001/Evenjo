"use server";

import { SeatType } from "./useSeatStor";
import { getSupabase } from "./supabase-server";

export async function submitDataToSupabase(items: SeatType) {
  const supabase = await getSupabase();
  const payload = {
    ...items,
    status: "selected",
  };

  const { error } = await supabase.from("event_seats").insert(payload);
  if (error) {
    console.error("Supabase Error:", error);
    throw new Error(`خطا در ثبت اطلاعات : ${error}`);
  }

  return { success: true };
}

export async function deleteDataFromSupabase(id: number, fakeUser: string) {
  const supabase = await getSupabase();

  const { error } = await supabase
    .from("event_seats")
    .delete()
    .eq("id", id)
    .eq("user_id", fakeUser);

  if (error) {
    console.error("Supabase Error:", error);
    throw new Error("خطا در ثبت اطلاعات");
  }

  return { success: true };
}

export async function mirgeSeatSelection(
  getFackUserId: string | null,
  registeredUserId: string | undefined,
) {
  const supabase = await getSupabase();

  if (registeredUserId) {
    const { error } = await supabase
      .from("event_seats")
      .update({ user_id: registeredUserId })
      .eq("user_id", getFackUserId);
    if (error) {
      console.log("Error updating seats:", error.message);
    } else {
      console.log("Seats successfully updated to registered user.");
    }
  }
}
