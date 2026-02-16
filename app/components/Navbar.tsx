"use client";

import { Logo, MenuH } from "@/app/Ui/svg";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import LoadingDot from "./LoadingDot";
import { useRouter } from "next/navigation";

const menu = ["Home", "Shows", "Concerts", "Sports", "Festivals"];

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

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
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handelSingOut = async () => {
    router.push("/profile/ticket", { scroll: true });
  };

  return (
    <nav>
      <div className="flex justify-between p-4 lg:hidden">
        <Link href={"/"}>
          <Logo className="fill-main" />
        </Link>
        <span
          className="flex justify-end cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <MenuH className="fill-main" />
        </span>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-neutral-700/50 z-90 lg:hidden"
            />

            <motion.div
              key="mobile-menu"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) setOpen(false);
              }}
              className="fixed left-0 right-0 bottom-0 w-full h-[85vh] rounded-t-3xl bg-tint-300 z-1000 flex flex-col items-center p-6 gap-y-4 lg:hidden"
            >
              <div className="w-12 h-1.5 bg-neutral-500/30 rounded-full mb-2" />

              <div className="w-full">
                <ul className="flex flex-col items-center gap-y-6 mt-8 text-main">
                  {menu.map((val) => (
                    <li
                      key={val}
                      onClick={() => setOpen(false)}
                      className="cursor-pointer text-2xl"
                    >
                      <Link
                        href={
                          val === "Home"
                            ? "/home"
                            : `/event/${val.toLowerCase()}`
                        }
                      >
                        {val}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-4 w-full mt-auto">
                {loading ? (
                  <LoadingDot />
                ) : user ? (
                  <span
                    onClick={() => handelSingOut()}
                    className="rounded-two w-full text-center bg-main text-white py-2 px-4"
                  >
                    {user.user_metadata.first_name}
                  </span>
                ) : (
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="rounded-two w-full text-center bg-main text-white py-2 px-4"
                  >
                    SignUp
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="hidden lg:flex lg:flex-row lg:justify-between lg:items-center lg:w-full lg:px-rl lg:py-4">
        <Link href={"/"}>
          <Logo className="fill-main" />
        </Link>
        <ul className="flex gap-6 text-neutral-200">
          {menu.map((val) => (
            <li
              key={val}
              className="cursor-pointer text-[18px] hover:text-white transition-all duration-150"
            >
              <Link
                href={val === "Home" ? "/home" : `/event/${val.toLowerCase()}`}
              >
                {val}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex gap-4">
          {loading ? (
            <LoadingDot />
          ) : user ? (
            <span
              onClick={() => handelSingOut()}
              className="rounded-two cursor-pointer bg-main text-white py-1.25 px-4"
            >
              {user.user_metadata.first_name}
            </span>
          ) : (
            <Link
              href="/signup"
              className="rounded-two bg-main text-white py-1.25 px-4"
            >
              SignUp
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
