"use client";

import Searchbox from "@/app/(evenjo)/home/_components/Searchbox";
import { Bookmark, Confetti, Ticket } from "@/app/Ui/svg";

const someFeatures = [
  {
    name: "Book Anytime",
    icon: <Bookmark />,
  },
  {
    name: "Refundable Tickets",
    icon: <Ticket />,
  },
  {
    name: "Smart Deals",
    icon: <Confetti />,
  },
];

const HeroSection = () => {
  return (
    <>
      <div className="relative pb-10">
        <div
          className="absolute inset-0 mask-t-from-80% mask-b-from-50% -z-20 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('group-people-near-stage-concert_250224-1752.webp')",
          }}
        />
        <div
          className={`mx-[calc(var(--spacing-rl)+104px)] mt-10 flex flex-col items-center justify-center`}
        >
          <h1 className=" text-[500%] text-center font-bold leading-[100%]">
            What <span className="text-tint-400">Concert</span> would you like
            to go to?
          </h1>
          <span className="my-10">
            More than 100 concerts in different countries are now available to
            you.
          </span>
        </div>
        <Searchbox />
        <div className="mx-[calc(var(--spacing-rl)+104px)] flex justify-center gap-8 py-4">
          {someFeatures.map((val) => {
            return (
              <div key={val.name} className="flex items-center gap-2">
                {val.icon}
                <span className=" text-neutral-200">{val.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default HeroSection;
