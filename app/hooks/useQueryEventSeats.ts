"use client";
import { useQuery } from "@tanstack/react-query";
import { SeatType } from "../lib/useSeatStor";
import { getAllEventSeats } from "../lib/server";

export const useQueryEventSeats = () => {
  const {
    data: getAllSeatEvent,
    isLoading,
    isPending,
  }: {
    data: SeatType[] | undefined;
    isLoading: boolean;
    isPending: boolean;
  } = useQuery({
    queryKey: ["eventSeats"],
    queryFn: async () => {
      return await getAllEventSeats();
    },
  });
  return [getAllSeatEvent, isLoading, isPending] as const;
};
