const BACKEND_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT;


export const getOrganizersAdminsList = 
async (
    data: any,
    token: string
  ) => {
    console.log("Calling API...");
    console.log("Token:", token);

    const response = await fetch(
      `${BACKEND_PORT}/admin/organizersAdminsList?data=${data}`,
      {
        method: "GET",
        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${token}`,
        },
        //body: JSON.stringify(data),
      }
    );

    console.log(
      "Status:",
      response.status
    );

    return response.json();
  };


export const approveEvent = 
async (
  eventId: string,
  token: string
) => {
  const response = await fetch(
    `${BACKEND_PORT}/admin/approval`,
    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        id: eventId,
      }),
    }
  );

  return response.json();
};

export const organizerAdminApproval = 
async (
    userId: string,
    token: string
  ) => {
    const response = await fetch(
      `${BACKEND_PORT}/admin/organizerAdminApproval`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          id: userId,
        }),
      }
    );

    return response.json();
  };