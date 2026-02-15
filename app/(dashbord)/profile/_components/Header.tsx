import profileAuth from "@/app/hooks/profileAuth";

import { Search } from "@/app/Ui/svg";
import Image from "next/image";

const Header = async () => {
  const { avatar_url, first_name, last_name } = await profileAuth();

  return (
    <div className="bg-neutral-800 w-full px-4 md:px-6 py-3 md:py-4 rounded-two md:rounded-three flex items-center justify-between gap-x-4">
      <div className="relative flex-1 md:flex-none md:w-[40%]">
        {/* <input
          type="text"
          placeholder="Search"
          className="w-full bg-neutral-600 outline-none text-neutral-100 rounded-two p-2 pl-9 placeholder:text-neutral-300 text-sm md:text-base transition-all focus:ring-1 focus:ring-main/50"
        /> */}
        <span className="absolute top-1/2 left-3 -translate-y-1/2">
          {/* <Search className="w-4 h-4 fill-neutral-300" /> */}
          Welcome , {first_name} {last_name}
        </span>
      </div>

      <div className="shrink-0">
        <div className="relative w-9 h-9 md:w-11 md:h-11 border-2 border-neutral-700 rounded-full p-0.5">
          <Image
            alt="User Profile"
            fill
            unoptimized
            className="rounded-full object-cover"
            src={`${avatar_url || "/avatar.png"}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
