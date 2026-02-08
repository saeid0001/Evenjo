import { getSupabase } from "@/app/lib/supabase-server";
import CountDown from "./_components/CountDown";
import PaymentCard from "./_components/PaymentCard";
import PaymentTrigger from "./_components/PaymentTrigger";
import { getAllEventSeatsByUserId } from "@/app/lib/server";
import SimpleBanner from "./_components/SimpleBanner";
import TriggerButton from "./_components/TriggerButton";
import SelectPaymentWay from "./_components/SelectPaymentWay";
import ReviewCheck from "./_components/ReviewCheck";
import Popup from "./_components/Popup";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const supabase = await getSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("user :", user);
  const getSeatUser = await getAllEventSeatsByUserId(user!.id, "payment");

  const params = await searchParams;
  const tiggr = params.triggr;

  const totalPrice = getSeatUser.reduce((acc, cur) => {
    return acc + cur.price_paid;
  }, 0);
  const ServicePrice = 100;

  if (getSeatUser.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <h1 className="text-2xl font-bold">No seats found for this user.</h1>
      </div>
    );
  }
  return (
    <>
      <Popup />
      <PaymentTrigger />
      <div className="grid grid-cols-12 justify-between px-rl py-20">
        <div className="col-span-5">
          <PaymentCard />
        </div>
        <div className="col-span-6 col-start-7 flex flex-col gap-y-10">
          <CountDown />
          {tiggr === "Tickets" && (
            <span>
              Make sure the number of tickets is correct before proceeding.{" "}
            </span>
          )}
          {tiggr === "Payment" && (
            <SelectPaymentWay
              totalPrice={totalPrice}
              ServicePrice={ServicePrice}
            />
          )}
          {tiggr === "Review" && (
            <ReviewCheck user={user!} totalPrice={totalPrice + ServicePrice} />
          )}
          {tiggr !== "Review" && <TriggerButton />}
          <SimpleBanner />
        </div>
      </div>
    </>
  );
};

export default page;
