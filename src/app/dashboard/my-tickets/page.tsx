"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  getBookHistory,
  cancelTicket,
} from "@/services/user.service";

import { useRouter } from "next/navigation";

import { FaDownload } from "react-icons/fa";

import { error } from "console";

export default function MyTicketsPage() {

  const router = useRouter()

  const [tickets, setTickets] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    const token= localStorage.getItem("token");
    if(!token){
      router.replace("/login")
    }
    
  }, []);

  const loadTickets =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const result =
          await getBookHistory(
            token || ""
          );

        setTickets(
          result.data || []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const handleDownloadTicket = async (
  ticketId: any
) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:8000/api/pdf/ticketDownload?ticketId=${ticketId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if (!response.ok) {
      const data = await response.json()
      throw new Error(
        data?.message//||"Failed to download ticket"
      );
    }

    const blob =
      await response.blob();

    const url =
      window.URL.createObjectURL(
        blob
      );

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `ticket-${ticketId}.pdf`;

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();

    window.URL.revokeObjectURL(
      url
    );
  } catch (error) {
    console.error(error);

    toast.error(
      "Unable to download ticket"
    );
  }
};

  const handleCancelTicket =
    async (
      ticketId: string
    ) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to cancel this ticket?"
        );

      if (!confirmed) return;

      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const result =
          await cancelTicket(
            ticketId,
            token || ""
          );

       if (result.status === 200) {
  toast.success(result.message);
} else {
  toast.error(result.message);
}

        if (
          result.status ===
          200
        ) {
          loadTickets();
        }
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to cancel ticket"
        );
      }
    };



  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="bg-white p-8 rounded-3xl shadow-xl">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>

        <p className="mt-4 text-slate-600 font-medium">
          Loading your tickets...
        </p>
      </div>
    </div>
  );
}

return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6 md:p-10">
    <div className="max-w-7xl mx-auto">

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-800">
          🎟 My Tickets
        </h1>

        <p className="text-slate-500 mt-2">
          View and manage all your event bookings
        </p>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200 p-16 text-center">
          <div className="text-7xl mb-4">
            🎫
          </div>

          <h2 className="text-2xl font-bold text-slate-700">
            No Tickets Found
          </h2>

          <p className="text-slate-500 mt-2">
            You haven't booked any events yet.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="group bg-white/90 backdrop-blur-sm border border-slate-200 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500" />

              <div className="p-6">

                <div className="flex justify-between items-start mb-4">
                  {/* <h2 className="text-2xl font-bold text-slate-800">
                    {ticket.schedule?.event?.name}
                  </h2>

                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                    Booked
                  </span> */}

                  <div className="flex justify-between items-start mb-4">
  <h2 className="text-2xl font-bold text-slate-800">
    {ticket.schedule?.event?.name}
  </h2>

  <div className="flex items-center gap-3">
    {/* <button
      onClick={() =>
        handleDownloadTicket(
          ticket.id
        )
      }
      className="
        p-2
        rounded-full
        bg-indigo-100
        text-indigo-600
        hover:bg-indigo-600
        hover:text-white
        transition
      "
      title="Download Ticket"
    >
      <FaDownload />
    </button> */}

    <span
      className="
        bg-green-100
        text-green-700
        text-xs
        font-semibold
        px-3
        py-1
        rounded-full
      "
    >
      Booked
    </span>
  </div>
</div>
                </div>

                <p className="text-slate-600 mb-5 line-clamp-2">
                  {ticket.schedule?.event?.description}
                </p>

                <div className="space-y-3 text-sm">

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Seats
                    </span>

                    <span className="font-semibold text-slate-800">
                      {ticket.seat_count}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Date
                    </span>

                    <span className="font-semibold text-slate-800">
                      {new Date(
                        ticket.schedule?.date
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Time
                    </span>

                    <span className="font-semibold text-slate-800">
                      {ticket.schedule?.time}
                    </span>
                  </div>

                     <div className="flex justify-between">
                    <span className="text-slate-500">
                      Venue
                    </span>

                    <span className="font-semibold text-slate-800">
                      {ticket.schedule?.address[0]?.address}
                    </span>
                  </div>

                </div>

                {/* {ticket.isCancelable && (
                  <button
                    onClick={() =>
                      handleCancelTicket(
                        ticket.id
                      )
                    }
                    className="mt-6 w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all duration-300"
                  >
                    Cancel Ticket
                  </button>

                  
                )} */}

                {ticket.isCancelable && (
  <div className="mt-6 flex gap-3">
    <button
      onClick={() =>
        handleCancelTicket(ticket.id)
      }
      className="
        flex-1
        py-3
        rounded-xl
        bg-red-500
        hover:bg-red-600
        text-white
        font-semibold
        transition-all
      "
    >
      Cancel Ticket
    </button>

    <button
      onClick={() =>
        handleDownloadTicket(ticket.id)
      }
      className="
        w-14
        flex
        items-center
        justify-center
        rounded-xl
        bg-indigo-600
        hover:bg-indigo-700
        text-white
        transition-all
      "
      title="Download Ticket"
    >
      <FaDownload />
    </button>
  </div>
)}

                {!ticket.isCancelable && (
                  <div className="mt-6 w-full py-3 rounded-xl bg-slate-100 text-slate-500 text-center font-medium">
                    Event Completed
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}