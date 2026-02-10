import { getSupabase } from "../lib/supabase-server";
import { userProfile } from "../lib/server";

const profileAuth = async () => {
  const supabase = await getSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profileUserData = await userProfile(supabase, user!.id);
  return profileUserData;
};

export default profileAuth;
