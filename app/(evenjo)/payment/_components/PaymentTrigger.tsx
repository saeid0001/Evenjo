"use client";
import { ArrowRight, CheckCircle, Dollar, Ticket } from "@/app/Ui/svg";
import { useSearchParams } from "next/navigation";

const PaymentTrigger = () => {
  const searchParams = useSearchParams();
  const triggr = searchParams.get("triggr");

  return (
    <div className="flex items-center justify-between w-[95%] md:w-2/4 mx-auto border-neutral-400 border-y mt-10 md:mt-20 py-4 px-4 md:px-12 gap-x-2">
      <div
        className={`flex items-center gap-1 shrink-0 ${triggr === "Tickets" ? "text-tint-400 bg-gradient-cool border border-tint-400" : ""} p-2 py-1.5 rounded-two`}
      >
        <Ticket
          className={`w-4 h-4 ${triggr === "Tickets" ? " fill-tint-400" : "fill-white "}`}
        />
        <span className="text-xs md:text-base font-medium">Tickets</span>
      </div>
      <ArrowRight className="fill-white shrink-0 w-4 h-4 md:w-auto md:h-auto" />

      <div
        className={`flex items-center gap-1 shrink-0 ${triggr === "Payment" ? "text-tint-400 bg-gradient-cool border border-tint-400" : ""} p-2 py-1.5 rounded-two`}
      >
        <Dollar
          className={`w-4 h-4 ${triggr === "Payment" ? " fill-tint-400" : "fill-white "}`}
        />
        <span className="text-xs md:text-base font-medium">Payment</span>
      </div>
      <ArrowRight className="fill-white shrink-0 w-4 h-4 md:w-auto md:h-auto" />
      <div
        className={`flex items-center gap-1 shrink-0 ${triggr === "Review" ? "text-tint-400 bg-gradient-cool border border-tint-400" : ""} p-2 py-1.5 rounded-two`}
      >
        <CheckCircle
          className={`w-4 h-4 ${triggr === "Review" ? " fill-tint-400" : "fill-white "}`}
        />
        <span className="text-xs md:text-base font-medium">Review</span>
      </div>
    </div>
  );
};

export default PaymentTrigger;
