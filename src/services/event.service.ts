const BACKEND_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT;


export const createEvent =
  async (
    data: FormData,
    token: string
  ) => {
    const response =
      await fetch(
        `${BACKEND_PORT}/event/createEvent`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: data,
        }
      );

    return response.json();
  };

export const updateEvent = 
async (
  data: FormData,
  token: string
) => {
  const response = await fetch(
    `${BACKEND_PORT}/event/updateEvent`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    }
  );

  return response.json();
};

export const getEventList = 
async (
  data: any,
  token: string
) => {
  const response = await fetch(
    `${BACKEND_PORT}/event/eventList?data=${data}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
};

export const getEventById = 
async (
  id: string,
  token: string
) => {
  const response = await fetch(
    `${BACKEND_PORT}/event/eventById?id=${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
};

export const cancelEvent = 
async (
  id: string,
  token: string
) => {
  const response = await fetch(
    `${BACKEND_PORT}/event/cancelEvent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    }
  );

  return response.json();
};