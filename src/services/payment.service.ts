import axios from "axios";

export const createOrder = async (
  id: string,
  seats: number,
  token: string
) => {
  const response = await axios.post(
    "http://localhost:8000/api/payment/createOrder",
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
    "http://localhost:8000/api/payment/verifyPayment",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};