"use client";

import LoadingDot from "@/app/components/LoadingDot";
import { deleteAllSeatWithUserId } from "@/app/lib/actionServer";
import { getAllEventSeatsByUserId } from "@/app/lib/server";
import { supabase } from "@/app/lib/supabase";
import { useEffect, useState } from "react";

const CountDown = () => {
  const [seconds, setSeconds] = useState<number | null>(null);

  useEffect(() => {
    const initTimer = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const getSeatUser = await getAllEventSeatsByUserId(user.id, "payment");

      if (getSeatUser.length > 0) {
        const createdAt = new Date(
          getSeatUser[getSeatUser.length - 1].created_at!,
        ).getTime();

        const tenMinutesInMs = 10 * 60 * 1000;
        const expiryTime = createdAt + tenMinutesInMs;

        const calculateRemaining = () => {
          const now = new Date().getTime();
          const remainingMs = expiryTime - now;
          return Math.max(0, Math.floor(remainingMs / 1000));
        };

        const initialRemaining = calculateRemaining();
        setSeconds(initialRemaining);

        const timer = setInterval(() => {
          const rem = calculateRemaining();
          setSeconds(rem);

          if (rem <= 0) {
            clearInterval(timer);
            deleteAllSeatWithUserId(user.id, "payment");
            window.location.pathname = "/";
          }
        }, 1000);

        return () => clearInterval(timer);
      } else {
        setSeconds(0);
      }
    };

    initTimer();
  }, []);

  const formatTimeArray = (secs: number) => {
    const minutes = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secs % 60).toString().padStart(2, "0");
    return (minutes + seconds).split("");
  };
  if (seconds === null) return <LoadingDot />;

  const timeDigits = formatTimeArray(seconds);

  return (
    <div className="flex items-center gap-x-4">
      <div className="flex items-center gap-x-2 direction-ltr">
        <div className="flex gap-x-1">
          <span className=" bg-gradient-warm px-4 py-2 rounded-two font-bold border border-neutral-700 ">
            {timeDigits[0]}
          </span>
          <span className="bg-gradient-warm px-4 py-2 rounded-two font-bold border border-neutral-700 ">
            {timeDigits[1]}
          </span>
        </div>
        <span className="font-bold text-xl">:</span>

        <div className="flex gap-x-1">
          <span className="bg-gradient-warm px-4 py-2 rounded-two font-bold border border-neutral-700 ">
            {timeDigits[2]}
          </span>
          <span className="bg-gradient-warm px-4 py-2 rounded-two font-bold border border-neutral-700  ">
            {timeDigits[3]}
          </span>
        </div>
      </div>
      <div className=" flex flex-col">
        <span className=" text-neutral-100">
          left to complete recive ticket
        </span>
        <span className=" text-neutral-200">
          Your price is only guaranteed for this time!
        </span>
      </div>
    </div>
  );
};

export default CountDown;
