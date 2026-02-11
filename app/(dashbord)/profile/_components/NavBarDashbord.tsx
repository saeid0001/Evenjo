"use client";

import { Logo, Ticket, User, Wallet } from "@/app/Ui/svg";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBarDashbord = () => {
  const pathname = usePathname();
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
    {
      name: "Payment",
      path: "/profile/payment",
      icon: Wallet,
    },
  ];
  return (
    <div className=" flex flex-col gap-y-8">
      <div className=" flex items-center justify-center w-full pt-4">
        <Logo className=" fill-main w-[50%] h-auto" />
      </div>
      <hr className=" text-neutral-700" />
      <div className="flex flex-col gap-y-2 items-strat">
        {menu.map((val) => {
          return (
            <Link
              href={val.path}
              key={val.name}
              className="flex relative group transition-all ease-in duration-150 hover:bg-main/50 hover:mask-r-from-0 justify-start px-4 py-2 cursor-pointer gap-x-2 items-center"
            >
              {
                <val.icon
                  className={`${pathname === val.path ? "fill-main" : "fill-white"}`}
                />
              }
              <span
                className={`${pathname === val.path ? "text-main" : "text-white"}`}
              >
                {val.name}
              </span>
              {pathname === val.path && (
                <>
                  <div className="w-1 h-full absolute top-0 left-0 bg-main" />
                  <div className="w-5 h-full absolute top-0 left-0 opacity-30 bg-main mask-r-from-0" />
                </>
              )}
              <div className="w-1 opacity-0 group-hover:opacity-100 h-full absolute top-0 left-0 bg-main" />
              <div className="w-5 opacity-0 group-hover:opacity-30  h-full absolute top-0 left-0 bg-main mask-r-from-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NavBarDashbord;
