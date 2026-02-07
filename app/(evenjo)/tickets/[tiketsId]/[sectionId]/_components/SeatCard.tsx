"use client";
import { sections } from "@/app/lib/types/event";
import { Chair, Ticket } from "@/app/Ui/svg";
import { useSearchParams } from "next/navigation";

const SeatCard = ({
  sectionData,
  prices,
}: {
  sectionData: sections;
  prices: number;
}) => {
  const searchParams = useSearchParams();
  const getSeatFilter = searchParams.get("row");

  const UpdateCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (getSeatFilter === category) {
      params.delete("row");
    } else {
      params.set("row", category);
    }
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  const getRow = [...new Set(sectionData.seats.map((val) => val.row))];

  return (
    <div
      className={`${getSeatFilter === sectionData.id ? " bg-main/20" : "bg-neutral-800"}  px-4 py-6 rounded-three`}
      onClick={() => UpdateCategory(sectionData.id)}
    >
      <div className="flex justify-between">
        <div className="flex items-start gap-x-3">
          <Chair className="fill-white mt-1" />
          <div className="flex flex-col">
            <span className=" text-[20px] font-bold">{sectionData.name}</span>
            <div className="flex gap-1">
              Row
              {getRow.map((val, index) => (
                <span key={val} className=" text-neutral-100">
                  {val} {getRow.length === index + 1 ? "" : "/"}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className=" text-main">
          <span className="text-[24px] font-bold">${prices}</span>
          <span className="text-[14px]">/per</span>
        </div>
      </div>
      <div className=" flex items-center gap-x-3">
        <Ticket className=" fill-white" />
        <span>{sectionData.seats.length} tickets, Available</span>
      </div>
      <div></div>
    </div>
  );
};

export default SeatCard;
