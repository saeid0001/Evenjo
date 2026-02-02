"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SeatType } from "./useSeatStor";

export async function submitDataToSupabase(items: SeatType) {
  const cookieStore = await cookies();

  // ساخت کلاینت (به صورت ناشناس کار میکنه چون کوکی لاگین وجود نداره)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );

  // ❌ این بخش که کاربر رو میگیره فعلا کامنت کن یا پاک کن
  // const { data: { user }, error: authError } = await supabase.auth.getUser();
  // if (authError || !user) throw new Error("...");

  const payload = {
    ...items,
    status: "selected",
  };

  const { error } = await supabase.from("event_seats").insert(payload);

  if (error) {
    console.error("Supabase Error:", error);
    throw new Error("خطا در ثبت اطلاعات");
  }

  return { success: true };
}

export async function deleteDataFromSupabase(id: string, fakeUser: string) {
  const cookieStore = await cookies();

  // ساخت کلاینت (به صورت ناشناس کار میکنه چون کوکی لاگین وجود نداره)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );

  const { error } = await supabase
    .from("event_seats")
    .delete()
    .eq("seat_id", id)
    .eq("user_id", fakeUser);

  if (error) {
    console.error("Supabase Error:", error);
    throw new Error("خطا در ثبت اطلاعات");
  }

  return { success: true };
}
