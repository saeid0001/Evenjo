"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { mirgeSeatSelection } from "@/app/lib/actionServer";
import { ArrowRight, Lock, Logo, Messages, Pattern, User } from "../Ui/svg";
import InputForm from "./_components/InputForm";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [sL, setSl] = useState("login");

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
            last_name: fname,
            first_name: name,
          },
        },
      });
    }
    const { data, error } = choisAuth;

    if (error) {
      toast.error(`${error.message}`);
    } else {
      const fakeId = localStorage.getItem("guest_session_id");
      if (fakeId) {
        await mirgeSeatSelection(fakeId, data.user?.id);
        localStorage.removeItem("guest_session_id");
      }
      toast.success(
        `Hello ${data.user?.user_metadata.first_name} , Wellcom Back`,
      );
      router.back();
    }
    setLoading(false);
  };

  return (
    <>
      <div
        onClick={() => router.back()}
        className="fixed flex top-6 left-6 md:top-10 md:left-10 cursor-pointer group hover:text-main font-bold z-50 transition-all active:scale-90"
      >
        <ArrowRight className="fill-white rotate-180 group-hover:fill-main" />
        Back
      </div>
      <div className="w-full relative">
        <div className="light_back absolute left-1/2 bg-main -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-2/4 opacity-30 md:opacity-100" />
        <div className="absolute -top-10 left-1/2 overflow-x-hidden -translate-x-1/2 -translate-y-1/2 scale-75 md:scale-100">
          <Pattern className="w-full h-auto" />
        </div>
      </div>

      <div className="flex flex-col items-center px-6 md:px-rl mt-32 md:my-40">
        <Logo className="fill-white w-32 md:w-40" />

        <h2 className="text-neutral-100 text-center text-sm md:text-base my-6 md:my-4">
          Please enter your phone number to login
        </h2>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-6 w-full max-w-md"
        >
          {sL === "signup" && (
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <InputForm
                inputFild={setName}
                svg={<User />}
                type="text"
                placeholder="Enter Name"
                label="Name"
                valueDefult={name}
              />
              <InputForm
                inputFild={setFname}
                svg={<User />}
                type="text"
                placeholder="Enter Last Name"
                label="Last Name"
                valueDefult={fname}
              />
            </div>
          )}

          <InputForm
            inputFild={setEmail}
            svg={<Messages />}
            type="email"
            placeholder="Enter Email"
            label="Email"
            valueDefult={email}
          />

          <InputForm
            inputFild={setPassword}
            svg={<Lock />}
            type="password"
            placeholder="Enter Password"
            label="Password"
            valueDefult={password}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-main text-white uppercase px-4 py-4 cursor-pointer rounded font-bold hover:bg-main/80 transition-all active:scale-[0.98] w-full"
          >
            {loading ? "Connecting..." : `${sL}`}
          </button>

          <button
            type="button"
            className="w-full text-center"
            onClick={(e) => {
              e.preventDefault();
              setSl(sL === "signup" ? "login" : "signup");
            }}
          >
            {sL === "signup" ? (
              <span className="text-neutral-200 text-sm">
                Have a Evenjo account?
                <span className="text-main cursor-pointer font-bold ml-1">
                  Sign in
                </span>
              </span>
            ) : (
              <span className="text-neutral-200 text-sm">
                New to Evenjo?
                <span className="text-main cursor-pointer font-bold ml-1">
                  Create account
                </span>
              </span>
            )}
          </button>
        </form>
      </div>
    </>
  );
}
