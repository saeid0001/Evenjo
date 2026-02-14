"use server";

import { SeatType } from "./useSeatStor";
import { getSupabase } from "./supabase-server";
import { generateOrderIdentifiers } from "./generateOrderIdentifiers";
import { UserProfile } from "./types/event";

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

export async function updateStatus(user: string, status: string) {
  const supabase = await getSupabase();
  const { orderId, trackingCode } = generateOrderIdentifiers();
  let query;
  if (status === "payment") {
    query = supabase
      .from("event_seats")
      .update({ status: status, created_at: new Date().toISOString() })
      .eq("user_id", user)
      .eq("status", "selected");
  } else {
    query = supabase
      .from("event_seats")
      .update({
        status: status,
        created_at: new Date().toISOString(),
        orderId,
        trackingCode,
      })
      .eq("user_id", user)
      .eq("status", "payment");
  }

  const { error } = await query;

  if (error) {
    console.error("Supabase Error:", error);
    throw new Error(`خطا در به‌روزرسانی وضعیت : ${error}`);
  }

  return { success: true };
}
export async function updateProfileUser(idUser: string, formInfo: UserProfile) {
  const supabase = await getSupabase();

  const { error } = await supabase
    .from("profiles")
    .update({
      ...formInfo,
    })
    .eq("id", idUser);

  if (error) {
    console.error("Supabase Error:", error);
    throw new Error(`خطا در به‌روزرسانی پروفایل : ${error}`);
  }

  return { success: true };
}

export async function deleteAllSeatWithUserId(id: string, status: string) {
  const supabase = await getSupabase();

  const { error } = await supabase
    .from("event_seats")
    .delete()
    .eq("user_id", id)
    .eq("status", status);

  if (error) {
    console.error("Supabase Error:", error);
    throw new Error("خطا در ثبت اطلاعات");
  }

  return { success: true };
}
