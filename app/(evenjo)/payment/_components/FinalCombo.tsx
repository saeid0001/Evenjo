"use Client";

const FinalCombo = ({
  totalPrice,
  ServicePrice,
}: {
  totalPrice: number;
  ServicePrice: number;
}) => {
  const totlaTicktprice = totalPrice;

  return (
    <div>
      <table className=" w-full">
        <tbody>
          <tr className="">
            <td className="py-2 px-4">Ticket Price</td>
            <td className="py-2 px-4 text-[18px] font-bold text-right tabular-nums">
              ${totlaTicktprice?.toLocaleString()}
            </td>
          </tr>
          <tr className="">
            <td className="py-2 px-4">Service fee</td>
            <td className="py-2 px-4 text-[18px] font-bold text-right tabular-nums">
              ${Number(ServicePrice).toLocaleString()}
            </td>
          </tr>
          <tr className=" border-t border-neutral-500">
            <td className="py-2 px-4 font-bold">Total Price</td>
            <td className="py-2 px-4 text-[18px] font-bold text-right tabular-nums text-main">
              ${(ServicePrice + totlaTicktprice!).toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FinalCombo;
