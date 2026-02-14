import { create } from "zustand";

export type SeatType = {
  id?: number;
  created_at?: string;
  event_id: string;
  event_type: string;
  turn_number: number;
  seat_id: string;
  section_id: string;
  row: string;
  number: number;
  status: string;
  user_id?: string;
  price_paid: number;
  event_name: string;
  section_name: string;
  clock: string;
  date: string;
  trackingCode?: string;
  orderId?: string;
};

interface SeatStor {
  selectItem: boolean;
  setSelectItem: (value: boolean) => void;
  popUpSeat: boolean;
  setPopUp: (value: boolean) => void;
  editeProfile: boolean;
  setEditeProfile: (value: boolean) => void;
}

export const useSeatStor = create<SeatStor>((set) => {
  return {
    selectItem: false,
    setSelectItem: (value) => set({ selectItem: value }),
    popUpSeat: false,
    setPopUp: (value) => set({ popUpSeat: value }),
    editeProfile: false,
    setEditeProfile: (value) => set({ editeProfile: value }),
  };
});
