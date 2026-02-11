import { v4 as uuidv4 } from "uuid";

export const generateOrderIdentifiers = () => {
  return {
    orderId: uuidv4(),
    trackingCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
  };
};
