"use client";

import { supabase } from "@/app/lib/supabase";
import { Logo, LogOut, Ticket, User } from "@/app/Ui/svg";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const NavBarDashbord = () => {
  const pathname = usePathname();
  const router = useRouter();
  const menu = [
    {
      name: "Tickets",
      path: "/profile/ticket",
      icon: Ticket,
    },
    {
      name: "Personal info",
      path: "/profile/info",
      icon: User,
    },
  ];
  const handelLogOut = async () => {
    await supabase.auth.signOut();
    toast.success("See You Later");
    router.push("/");
  };
  return (
    <div className="flex flex-row lg:flex-col items-center lg:items-stretch justify-around lg:justify-start gap-y-8 h-full">
      <Link
        href={"/"}
        className=" lg:flex items-center justify-center w-fit lg:w-full lg:pt-4 pl-2"
      >
        <Logo className="fill-main lg:w-[50%] w-2/4 h-auto" />
      </Link>

      <hr className="hidden lg:block border-neutral-700" />

      <div className="flex flex-row lg:flex-col flex-1 w-full justify-around lg:justify-start gap-x-2 lg:gap-y-2">
        {menu.map((val) => {
          const isActive = pathname === val.path;
          return (
            <Link
              href={val.path}
              key={val.name}
              className={`
            flex flex-col lg:flex-row items-center lg:justify-start
            px-3 py-2 lg:px-4 lg:py-2 rounded-two relative
            transition-all duration-150 gap-1 lg:gap-x-2
            ${isActive ? "text-main" : "text-white"}
          `}
            >
              <val.icon
                className={`w-5 h-5 lg:w-6 lg:h-6 ${isActive ? "fill-main" : "fill-white"}`}
              />

              <span className="text-[10px] lg:text-base font-medium capitalize">
                {val.name}
              </span>

              {isActive && (
                <>
                  <div className="hidden lg:block w-1 h-full absolute top-0 left-0 bg-main" />
                  <div className="lg:hidden w-full h-1 absolute -top-2 left-0 bg-main rounded-full" />
                </>
              )}
            </Link>
          );
        })}
      </div>

      <hr className="hidden lg:block border-neutral-700" />

      <div
        onClick={handelLogOut}
        className="flex flex-col lg:flex-row items-center lg:justify-start px-3 py-2 lg:px-4 lg:py-2 gap-1 lg:gap-x-2 cursor-pointer"
      >
        <LogOut className="fill-white w-5 h-5 lg:w-6 lg:h-6" />
        <span className="text-[10px] lg:text-base text-white font-medium">
          Log Out
        </span>
      </div>
    </div>
  );
};

export default NavBarDashbord;
