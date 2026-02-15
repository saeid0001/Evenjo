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
    icon: <Ticket className="fill-neutral-100" />,
  },
  {
    name: "Smart Deals",
    icon: <Confetti />,
  },
];

const HeroSection = () => {
  return (
    <>
      <div className="relative pb-10 min-h-[60vh] flex flex-col justify-center">
        <div
          className="absolute inset-0 mask-t-from-80% mask-b-from-50% -z-20 bg-cover bg-center bg-no-repeat opacity-100"
          style={{
            backgroundImage:
              "url('group-people-near-stage-concert_250224-1752.webp')",
          }}
        />

        <div className="px-6 md:px-12 lg:mx-[calc(var(--spacing-rl)+104px)] mt-10 flex flex-col items-center justify-center">
          <h1 className="text-[250%] md:text-[400%] lg:text-[500%] text-center font-bold leading-[110%] lg:leading-[100%]">
            What <span className="text-tint-400">Concert</span> would you like
            to go to?
          </h1>
          <span className="my-6 lg:my-10 text-center text-sm md:text-base lg:text-lg max-w-md lg:max-w-none">
            More than 100 concerts in different countries are now available to
            you.
          </span>
        </div>

        <div className="w-full px-6 lg:px-0">
          <Searchbox />
        </div>

        <div className="px-6 lg:mx-[calc(var(--spacing-rl)+104px)] flex flex-wrap justify-center gap-4 md:gap-8 py-6">
          {someFeatures.map((val) => {
            return (
              <div
                key={val.name}
                className="flex items-center gap-2 bg-white/5 lg:bg-transparent p-2 lg:p-0 rounded-lg"
              >
                {val.icon}
                <span className="text-xs md:text-sm lg:text-base text-neutral-200 whitespace-nowrap">
                  {val.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default HeroSection;
