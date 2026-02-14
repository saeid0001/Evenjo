import profileAuth from "@/app/hooks/profileAuth";

import { Search } from "@/app/Ui/svg";
import Image from "next/image";

const Header = async () => {
  const { avatar_url } = await profileAuth();

  return (
    <div className=" bg-neutral-800 w-full px-6 py-4 rounded-three flex items-center justify-between">
      <div className=" relative w-[40%]">
        <input
          type="text"
          name=""
          id=""
          placeholder="Search"
          className="w-full bg-neutral-600 outline-none text-neutral-100 rounded-two  p-2 pl-8 placeholder:text-neutral-300"
        />
        <span className=" absolute top-[50%] left-2 -translate-y-2/4">
          <Search className=" w-4 h-4 fill-neutral-300" />
        </span>
      </div>
      <div>
        <div className=" relative w-10 h-10">
          <Image
            alt=""
            fill
            unoptimized
            className=" rounded-full object-fit"
            src={`${avatar_url || "/avatar.png"}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
