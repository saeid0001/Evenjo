import { Dollar, ShieldCheck } from "@/app/Ui/svg";

const SimpleBanner = () => {
  return (
    <div className=" flex flex-col gap-y-4 bg-neutral-800 border-2 border-neutral-600 px-6 py-8 rounded-three">
      <div className=" flex gap-x-2 items-center">
        <ShieldCheck />
        <span>FanProtect : every order is 100% guaranteed</span>
      </div>
      <div className=" flex gap-x-2 items-start">
        <Dollar className="fill-white w-6 h-6" />
        <div className="flex flex-col gap-y-1">
          <span>Easy Refund</span>
          <span className="text-neutral-200">
            Change of plans?Get your money back up to 24 hours before the event.
          </span>
        </div>
      </div>
    </div>
  );
};

export default SimpleBanner;
