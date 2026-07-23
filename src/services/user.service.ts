const BACKEND_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT;;

export const bookTicket = 
  async (
    scheduleId: string,
    seats: number,
    token: string
  ) => {
    const response = await fetch(
      `${BACKEND_PORT}/user/bookTicket`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: scheduleId,
          seats,
        }),
      }
    );
    return response.json();
  };

export const getBookHistory =
  async (token: string) => {
    const response =
      await fetch(
        `${BACKEND_PORT}/user/bookHistory`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    return response.json();
  };


export const cancelTicket =
  async (
    ticketId: string,
    token: string
  ) => {
    const response =
      await fetch(
        `${BACKEND_PORT}/user/cancelTicket`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: ticketId,
          }),
        }
      );

    return response.json();
  };