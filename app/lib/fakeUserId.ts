import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase";

export const fakeUserId = async () => {
  const { data } = await supabase.auth.getUser();
  if (data.user?.id) return null;

  if (typeof window === "undefined") return null;

  let sessionId = localStorage.getItem("guest_session_id");
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem("guest_session_id", sessionId);
  }
  return sessionId;
};
