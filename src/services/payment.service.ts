import axios from "axios";
const BACKEND_PORT= process.env.NEXT_PUBLIC_BACKEND_PORT;
export const createOrder = async (
  id: string,
  seats: number,
  token: string
) => {
  const response = await axios.post(
    `${BACKEND_PORT}/payment/createOrder`,
    {
      id,
      seats,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const verifyPayment = async (
  payload: any,
  token: string
) => {
  const response = await axios.post(
    `${BACKEND_PORT}/payment/verifyPayment`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};