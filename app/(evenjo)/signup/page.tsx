"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { mirgeSeatSelection } from "@/app/lib/actionServer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [sL, setSl] = useState("signup");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let choisAuth;
    if (sL === "login") {
      choisAuth = await supabase.auth.signInWithPassword({
        email,
        password,
      });
    } else {
      choisAuth = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fname,
            name: name,
            photo: photo,
          },
        },
      });
    }
    const { data, error } = await choisAuth;

    if (error) {
      alert("خطا در ثبت نام: " + error.message);
    } else {
      const fakeId = localStorage.getItem("guest_session_id");
      if (fakeId) {
        await mirgeSeatSelection(fakeId, data.user?.id);
        localStorage.removeItem("guest_session_id");
      }
      router.back();
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-10 bg-neutral-900 text-white rounded-lg">
      <h2 className="mb-4 text-2xl font-bold">{sL} to Your Account</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
        <input
          type="email"
          placeholder="Email"
          className="p-2 rounded bg-neutral-800 border border-neutral-700"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 rounded bg-neutral-800 border border-neutral-700"
          onChange={(e) => setPassword(e.target.value)}
        />
        {sL === "signup" && (
          <>
            <input
              type="text"
              placeholder="name"
              className="p-2 rounded bg-neutral-800 border border-neutral-700"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="fname"
              className="p-2 rounded bg-neutral-800 border border-neutral-700"
              onChange={(e) => setFname(e.target.value)}
            />
            <input
              type="text"
              placeholder="photo URL"
              className="p-2 rounded bg-neutral-800 border border-neutral-700"
              onChange={(e) => setPhoto(e.target.value)}
            />
          </>
        )}

        <button
          disabled={loading}
          className="bg-main p-2 rounded font-bold hover:bg-main/80"
        >
          {loading ? "Connecting..." : `${sL}`}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setSl(sL === "signup" ? "login" : "signup");
          }}
        >
          {sL}
        </button>
      </form>
    </div>
  );
}
