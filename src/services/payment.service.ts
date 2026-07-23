import axios from "axios";
const API= process.env.NEXT_PUBLIC_BACKEND_PORT;
export const createOrder = async (
  id: string,
  seats: number,
  token: string
) => {
  const response = await axios.post(
    `${API}/payment/createOrder`,
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
    `${API}/payment/verifyPayment`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};