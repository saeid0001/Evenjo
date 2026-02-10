"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { mirgeSeatSelection } from "@/app/lib/actionServer";
import { Lock, Logo, Messages, Pattern, User } from "../Ui/svg";
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
            full_name: fname,
            name: name,
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
      toast.success(`Hello ${data.user?.user_metadata.name} , Wellcom Back`);
      router.back();
    }
    setLoading(false);
  };

  return (
    <>
      <div
        onClick={() => router.back()}
        className=" fixed top-10 left-10 cursor-pointer hover:text-main font-bold"
      >{`< Back`}</div>
      <div className="w-full relative">
        <div className=" light_back absolute left-2/4 bg-main -translate-x-2/4  -translate-y-2/4 w-2/4" />
        <div className=" absolute -top-10 left-2/4 -translate-x-2/4 -translate-y-2/4">
          <Pattern />
        </div>
      </div>
      <div className=" flex flex-col items-center px-rl my-40">
        <Logo className=" fill-white" />
        <h2 className="text-neutral-100 my-4">
          Please enter your phone number to login
        </h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-2/4">
          {sL === "signup" && (
            <div className=" flex gap-x-4 w-full">
              <InputForm
                inputFild={setName}
                svg={<User />}
                type="text"
                placeholder="Enter Name"
                label="Name"
              />
              <InputForm
                inputFild={setFname}
                svg={<User />}
                type="text"
                placeholder="Enter Last Name"
                label="Last Name"
              />
            </div>
          )}

          <InputForm
            inputFild={setEmail}
            svg={<Messages />}
            type="email"
            placeholder="Enter Email"
            label="Email"
          />
          <InputForm
            inputFild={setPassword}
            svg={<Lock />}
            type="password"
            placeholder="Enter Password"
            label="Password"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-main uppercase px-4 py-3.5 cursor-pointer rounded font-bold hover:bg-main/80"
          >
            {loading ? "Connecting..." : `${sL}`}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setSl(sL === "signup" ? "login" : "signup");
            }}
          >
            {sL === "signup" ? (
              <span className=" text-neutral-200">
                Have a Evenjo account ?
                <span className=" text-main cursor-pointer"> Sign in</span>
              </span>
            ) : (
              <span className=" text-neutral-200">
                New to Evenjo ?
                <span className=" text-main cursor-pointer">
                  {" "}
                  Create acoount
                </span>
              </span>
            )}
          </button>
        </form>
      </div>
    </>
  );
}
