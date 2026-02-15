"use client";

import { updateStatus } from "@/app/lib/actionServer";
import { Dollar, Messages, User as UserName } from "@/app/Ui/svg";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const ReviewCheck = ({
  user,
  totalPrice,
}: {
  user: User;
  totalPrice: number;
}) => {
  const route = useRouter();
  const name = `${user.user_metadata.name} ${user.user_metadata.full_name}`;
  const email = `${user.user_metadata.email}`;

  const handelPaySeat = async () => {
    await updateStatus(user.id, "sold");
    route.push("/payment/success");
  };

  return (
    <>
      <div className=" relative">
        <div className="w-1 h-full bg-main absolute mask-y-from-1" />
        <div className=" flex flex-col gap-y-2 px-4">
          <div className=" flex items-center gap-x-2">
            <UserName />
            <span className=" font-medium">{name}</span>
          </div>
          <div className=" flex items-center gap-x-2">
            <Messages />
            <span className=" font-medium">{email}</span>
          </div>
          <div className=" flex items-center gap-x-2">
            <Dollar className=" fill-neutral-100 w-6 h-6" />
            <span className=" font-medium">
              Total Price : ${totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      <div className=" flex gap-x-4 w-full mt-5">
        <button
          onClick={() => route.back()}
          className=" w-full border border-main px-4 py-3 rounded-two cursor-pointer hover:bg-main/80"
        >
          Back
        </button>
        <button
          onClick={handelPaySeat}
          className=" w-full bg-main px-4 py-3 rounded-two cursor-pointer hover:bg-main/80"
        >
          Pay
        </button>
      </div>
    </>
  );
};

export default ReviewCheck;
