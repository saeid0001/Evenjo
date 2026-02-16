import { getSupabase } from "@/app/lib/supabase-server";
import CountDown from "./_components/CountDown";
import PaymentCard from "./_components/PaymentCard";
import PaymentTrigger from "./_components/PaymentTrigger";
import { getAllEventSeatsByUserId, userProfile } from "@/app/lib/server";
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
  const getSeatUser = await getAllEventSeatsByUserId(user!.id, "payment");
  const userInfo = await userProfile(supabase, user!.id);

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

      <div className="grid grid-cols-12 gap-y-10 md:gap-x-6 lg:gap-x-12 px-6 md:px-rl py-10 md:py-20">
        <div className="col-span-12 lg:col-span-5 order-2 lg:order-1">
          <PaymentCard />
        </div>

        <div className="col-span-12 lg:col-span-6 lg:col-start-7 flex flex-col gap-y-6 md:gap-y-10 order-1 lg:order-2">
          <CountDown />

          <div className="min-h-12.5">
            {tiggr === "Tickets" && (
              <span className="text-sm md:text-base text-neutral-300 block leading-relaxed">
                Make sure the number of tickets is correct before proceeding.
              </span>
            )}

            {tiggr === "Payment" && (
              <SelectPaymentWay
                totalPrice={totalPrice}
                ServicePrice={ServicePrice}
              />
            )}

            {tiggr === "Review" && (
              <ReviewCheck
                user={userInfo}
                totalPrice={totalPrice + ServicePrice}
              />
            )}
          </div>

          {tiggr !== "Review" && (
            <div className="w-full">
              <TriggerButton />
            </div>
          )}

          <SimpleBanner />
        </div>
      </div>
    </>
  );
};

export default page;
