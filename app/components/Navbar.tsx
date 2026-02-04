"use client";

import { Logo } from "@/app/Ui/svg";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import LoadingDot from "./LoadingDot";
import { useRouter } from "next/navigation";

const menu = ["Home", "Shows", "Concerts", "Sports", "Festivals"];

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const route = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const {
        data: { user: myuser },
      } = await supabase.auth.getUser();
      setUser(myuser);
      setLoading(false);
    };
    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth Event:", event);
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // پاکسازی در هنگام Unmount شدن کامپوننت
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handelSingOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.reload();
  };

  console.log(user);
  return (
    <div className="flex justify-between items-center px-rl py-4">
      <div>
        <Logo />
      </div>
      <div>
        <ul className="flex gap-6 text-neutral-200">
          {menu.map((val) => {
            return (
              <li
                className="cursor-pointer text-[18px] hover:text-white transition-all ease-in duration-150"
                key={val}
              >
                <Link href={`/${val.toLowerCase()}`}>{val}</Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex gap-4">
        <select name="" id="">
          <option value="eng">eng</option>
        </select>
        {loading && <LoadingDot />}
        {!loading &&
          (user ? (
            <div className="flex items-center gap-4">
              {/* {user.user_metadata.photo && (
                <Image
                  src={user.user_metadata.photo}
                  alt={user.user_metadata.name || "User avatar"}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full"
                />
              )} */}
              <span
                onClick={() => handelSingOut()}
                className=" rounded-two cursor-pointer transition-all ease-in duration-150 bg-main text-white border border-main py-1.25 px-4"
              >
                {user.user_metadata.name}
              </span>
            </div>
          ) : (
            <Link
              href="/signup"
              className=" rounded-two transition-all ease-in duration-150 hover:bg-tint-1 bg-main text-white border border-main py-1.25 px-4 cursor-pointer"
            >
              SignUp
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Navbar;
