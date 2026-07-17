const API =
  "http://localhost:8000/api";

export const bookTicket = 
  async (
    scheduleId: string,
    seats: number,
    token: string
  ) => {
    const response = await fetch(
      `${API}/user/bookTicket`,
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
        `${API}/user/bookHistory`,
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
        `${API}/user/cancelTicket`,
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