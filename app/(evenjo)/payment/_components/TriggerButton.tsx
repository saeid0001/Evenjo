"use client";

import { useRouter, useSearchParams } from "next/navigation";

const TriggerButton = () => {
  const searchParams = useSearchParams();
  const triggr = searchParams.get("triggr");
  const router = useRouter();

  const UpdateCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("triggr", category);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handelChangeTrigger = () => {
    switch (triggr) {
      case "Tickets":
        UpdateCategory("Payment");
        break;
      case "Payment":
        UpdateCategory("Review");
      default:
        break;
    }
  };

  return (
    <button
      onClick={handelChangeTrigger}
      className=" w-full bg-main px-4 py-3 rounded-two hover:bg-main/80 cursor-pointer"
    >
      Confirm
    </button>
  );
};

export default TriggerButton;
