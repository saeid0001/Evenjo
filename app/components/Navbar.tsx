import React from "react";
import { Logo } from "@/app/Ui/svg";
import Link from "next/link";

const menu = ["Home", "Shows", "Concerts", "Sports", "Festivals"];

const Navbar = () => {
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
        <button className=" rounded-two transition-all ease-in duration-150 hover:bg-tint-1 bg-main text-white border border-main py-1.25 px-4 cursor-pointer">
          SignUp
        </button>
      </div>
    </div>
  );
};

export default Navbar;
