import { create } from "zustand";

export type SeatType = {
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
};

interface SeatStor {
  selectItem: SeatType[];
  addItem: (items: SeatType) => void;
  removeItem: (id: string) => void;
}

export const useSeatStor = create<SeatStor>((set) => {
  return {
    selectItem: [],
    addItem: (items) =>
      set((state) => {
        const exists = state.selectItem.find(
          (i) => i.seat_id === items.seat_id,
        );
        if (exists) return state;
        return { selectItem: [...state.selectItem, items] };
      }),
    removeItem: (id) =>
      set((state) => ({
        selectItem: state.selectItem.filter((item) => item.seat_id !== id),
      })),
  };
});
