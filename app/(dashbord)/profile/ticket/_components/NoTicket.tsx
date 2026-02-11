import Image from "next/image";
import Link from "next/link";

const NoTicket = () => {
  return (
    <div className=" flex flex-col items-center justify-center gap-y-4 h-full">
      <div className=" relative w-50 h-50">
        <Image
          src="/basket1.webp"
          alt="ooops!!!"
          fill
          className=" object-cover"
        />
      </div>
      <span>ooops!!!</span>
      <span className=" w-[40%] text-center text-neutral-100">
        You haven’t booked any tickets yet. Explore exciting events and secure
        your spot now!
      </span>
      <Link
        href={"/"}
        className=" bg-main  text-center px-4 py-2 w-[40%] rounded-two cursor-pointer hover:bg-main/80 transition-all ease-in duration-150"
      >
        Brows Events
      </Link>
    </div>
  );
};

export default NoTicket;
