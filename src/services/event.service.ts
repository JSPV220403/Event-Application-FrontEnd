const API_URL = "http://localhost:8000/api";

// export const createEvent = 
// async (
//   data: any,
//   token: string
// ) => {
//   const response = await fetch(
//     `${API_URL}/event/createEvent`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(data),
//     }
//   );

//   return response.json();
// };

export const createEvent =
  async (
    data: FormData,
    token: string
  ) => {
    const response =
      await fetch(
        `${API_URL}/event/createEvent`,
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
    `${API_URL}/event/updateEvent`,
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
    `${API_URL}/event/eventList?data=${data}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      //body: JSON.stringify(data),
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
    `${API_URL}/event/eventById?id=${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
     // body: JSON.stringify({ id }),
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
    `${API_URL}/event/cancelEvent`,
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