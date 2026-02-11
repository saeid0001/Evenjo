import { userTicketByOrderId } from "@/app/lib/server";
import React from "react";

const page = async ({
  params,
}: {
  params: Promise<{ ticketOrderId: string }>;
}) => {
  const { ticketOrderId } = await params;
  const ticket = await userTicketByOrderId(ticketOrderId);

  console.log(ticket);

  return <div>page </div>;
};

export default page;
