"use server";
import { revalidatePath } from "next/cache";
import { getSupabase } from "./supabase-server";

export async function uploadAvatar(userId: string, formData: FormData) {
  const supabase = await getSupabase();
  const file = formData.get("file") as File;

  if (!file) throw new Error("فایلی انتخاب نشده است");

  const filePath = `${userId}/${Math.random()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", userId);

  if (updateError) throw updateError;

  revalidatePath("/", "layout");

  return publicUrl;
}
