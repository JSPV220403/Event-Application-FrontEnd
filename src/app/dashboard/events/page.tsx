"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

import { approveEvent } from "@/services/admin.service";

import { createOrder, verifyPayment } from "@/services/payment.service";

import { getEventList, cancelEvent } from "@/services/event.service";

import { useAuth } from "@/context/AuthContext";
import { getCategories } from "@/services/category.service";

export default function EventsPage() {
  const { user } = useAuth();
  const router = useRouter();

  console.log("User: ", user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, []);

  const [events, setEvents] = useState<any[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("approved");
  const [showProfile, setShowProfile] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Payment ticket id
  const [tickerId, setTicketId] = useState<string>("");

  const [showTransactions, setShowTransactions] = useState(false);

  const [transactions, setTransactions] = useState<any[]>([]);

  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const [showBookingModal, setShowBookingModal] = useState(false);

  const [selectedScheduleId, setSelectedScheduleId] = useState("");

  const [seatCount, setSeatCount] = useState(1);

  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);

  const [categories, setCategories] = useState<any[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (!user) return;
    setFilter("approved");
  }, [user]);

  useEffect(() => {
    if (user?.role === "USER") {
      loadCategories();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user]);

  useEffect(() => {
    let filtered = [...allEvents];

    filtered = filtered.filter((event) => {
      const approvalStatus = event.approval?.[0]?.approved_by
        ? "approved"
        : "unapproved";

      return approvalStatus === filter;
    });

    if (selectedCategory) {
      filtered = filtered.filter(
        (event) => event.category_id === selectedCategory,
      );
    }

    if (search.trim()) {
      filtered = filtered.filter((event) =>
        event.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    setEvents(filtered);
  }, [filter, selectedCategory, search, allEvents]);

  useEffect(() => {
    const storedEvents = localStorage.getItem("allEvents");

    if (!storedEvents) return;

    const eventsData = JSON.parse(storedEvents);

    if (!selectedCategory) {
      setEvents(eventsData);
      return;
    }

    const filteredEvents = eventsData.filter(
      (event: any) => event.category?.id === selectedCategory,
    );

    setEvents(filteredEvents);
  }, [selectedCategory]);

  const loadEvents = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const result = await getEventList({}, token || "");

      const data = result.data || [];
      setEvents(data);
      setAllEvents(data);

      localStorage.setItem("allEvents", JSON.stringify(data));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      setLoadingTransactions(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api/user/myTransactions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.status === 200) {
        setTransactions(data.data || []);
        setShowTransactions(true);
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to load transactions");
    } finally {
      setLoadingTransactions(false);
    }
  };

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem("token");

      const result = await getCategories(token || "");

      setCategories(result.data || []);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelEvent = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this event?",
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const result = await cancelEvent(id, token || "");

      if (result.status === 200) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      if (result.status === 200) {
        loadEvents();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel event");
    }
  };

  const handleDownloadBookings = (schedule: any) => {
    if (schedule.bookedSeats <= 0) {
      toast.error("No bookings yet");
      return;
    }

    window.open(
      `http://localhost:8000/api/pdf/downloadBookings?scheduleId=${schedule.id}`,
      "_blank",
    );
  };

  const handleApproveEvent = async (eventId: string) => {
    try {
      const token = localStorage.getItem("token");

      const result = await approveEvent(eventId, token || "");

      if (result.status === 200) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      if (result.status === 200) {
        //loadEvents();
        setAllEvents((prev) =>
          prev.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  approval: [
                    {
                      approved_by: "some-id",
                    },
                  ],
                }
              : event,
          ),
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve event");
    }
  };

  const handleBookTicket = (schedule: any) => {
    setSelectedSchedule(schedule);

    setSelectedScheduleId(schedule.id);

    setSeatCount(1);

    setShowBookingModal(true);
  };

  const downloadTicket = async (ticketId: any) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:8000/api/pdf/ticketDownload?ticketId=${ticketId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "ticket.pdf";

    a.click();

    window.URL.revokeObjectURL(url);
  };

  const confirmBooking = async () => {
    try {
      const token = localStorage.getItem("token");

      const orderResult = await createOrder(
        selectedScheduleId,
        seatCount,
        token || "",
      );

      const order = orderResult.data;

      let paymentHandled = false;

      const options = {

        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: order.amount,
        currency: order.currency,
        name: "Event Booking",
        description: "Ticket Booking",
        order_id: order.id,

        handler: async (response: any) => {
          if (paymentHandled) return;

          paymentHandled = true;
          const verifyResult = await verifyPayment(
            {
              id: selectedScheduleId,
              seats: seatCount,

              payment_status: "SUCCESS",

              razorpay_order_id: response.razorpay_order_id,

              razorpay_payment_id: response.razorpay_payment_id,

              razorpay_signature: response.razorpay_signature,
            },
            token || "",
          );

          if (verifyResult.status === 200) {
            toast.success("Payment Successful");
            setTicketId(verifyResult.data.ticket_id);
            setShowBookingModal(false);

            setEvents((prev) =>
              prev.map((event) => ({
                ...event,
                schedule: event.schedule.map((schedule: any) =>
                  schedule.id === selectedScheduleId
                    ? {
                        ...schedule,
                        availableSeats: schedule.availableSeats - seatCount,
                      }
                    : schedule,
                ),
              })),
            );
            setShowSuccessPopup(true);
          }
        },

        modal: {
          ondismiss: async () => {
            if (paymentHandled) return;

            paymentHandled = true;
            await verifyPayment(
              {
                id: selectedScheduleId,
                seats: seatCount,

                payment_status: "CANCELLED",

                razorpay_order_id: order.id,
              },
              token || "",
            );

            toast("Payment window closed");
          },
        },

        theme: {
          color: "#4f46e5",
        },
      };

      const razor = new (window as any).Razorpay(options);

      razor.on("payment.failed", async (response: any) => {
        if (paymentHandled) return;

        paymentHandled = true;
        await verifyPayment(
          {
            id: selectedScheduleId,

            seats: seatCount,

            payment_status: "FAILED",

            razorpay_order_id: response.error.metadata.order_id,

            razorpay_payment_id: response.error.metadata.payment_id,
          },
          token || "",
        );

        toast.error(response.error.description || "Payment Failed");
      });

      razor.open();
    } catch (error) {
      console.error(error);

      toast.error("Unable to create payment");
    }
  };

  const canEditEvent = (event: any) => {
    if (user?.status === "PENDING") {
      return false;
    }

    if (user?.role === "ADMIN") {
      return true;
    }

    if (user?.role === "ORGANIZER") {
      return event.organizer?.id === user.id;
    }

    return false;
  };

  const canCancelEvent = (event: any) => {
    if (user?.status === "PENDING") {
      return false;
    }

    if (user?.role === "ADMIN") {
      return true;
    }

    if (user?.role === "ORGANIZER") {
      return event.organizer?.id === user.id;
    }

    return false;
  };

  const canApproveEvent = (event: any) =>
    user?.role === "ADMIN" &&
    user?.status === "APPROVED" &&
    filter === "unapproved";

  const canCreate =
    (user?.role === "ADMIN" || user?.role === "ORGANIZER") &&
    user?.status !== "PENDING";

  const canManageEvent = (event: any) =>
    (user?.role === "ADMIN" || user?.role === "ORGANIZER") &&
    user?.status !== "PENDING";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100">
        <div className="text-center">
          <div
            className="
          w-14
          h-14
          border-4
          border-indigo-600
          border-t-transparent
          rounded-full
          animate-spin
          mx-auto
          "
          />

          <p className="mt-4 text-gray-600">Loading Events...</p>
        </div>
      </div>
    );
  }

  const totalAvailableSeats = Number(selectedSchedule?.availableSeats || 0);

  const remainingSeats = totalAvailableSeats - Number(seatCount);

  const totalPrice = Number(seatCount) * Number(selectedSchedule?.price || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div className="w-full">
            <div
              className="
relative
overflow-hidden
rounded-[32px]
bg-gradient-to-r
from-slate-900
via-indigo-900
to-purple-900
shadow-2xl
"
            >
              <div className="absolute inset-0 bg-black/20" />

              <div
                className="
absolute
top-0
right-0
w-[450px]
h-[450px]
bg-pink-500/20
rounded-full
blur-3xl
"
              />

              <div
                className="
absolute
bottom-0
left-0
w-[350px]
h-[350px]
bg-cyan-400/20
rounded-full
blur-3xl
"
              />
              <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 mb-12 p-4">
                <div
                  className="
relative
overflow-hidden
rounded-none
lg:rounded-b-[40px]
bg-gradient-to-r
from-slate-900
via-indigo-900
to-purple-900
min-h-[420px]
shadow-2xl
"
                >
                  <div className="absolute inset-0 bg-black/20" />

                  <div
                    className="
absolute
top-0
right-0
w-[500px]
h-[500px]
bg-pink-500/20
rounded-full
blur-3xl
"
                  />

                  <div
                    className="
absolute
bottom-0
left-0
w-[400px]
h-[400px]
bg-cyan-500/20
rounded-full
blur-3xl
"
                  />

                  <div className="relative p-10">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-3xl font-black text-white">
                          🎟 EventHub
                        </h2>

                        <p className="text-slate-300">
                          Premium Event Booking Platform
                        </p>
                      </div>

                      <button
                        onClick={() => setShowMenu(!showMenu)}
                        className=" w-14 h-14 rounded-2xl bg-white/10
          backdrop-blur-md text-white text-3xl hover:bg-white/20 transition "
                      >
                        ☰
                      </button>
                    </div>

                    <div className="mt-20 max-w-3xl">
                      <h1
                        className="
text-6xl
font-black
leading-tight
text-white
"
                      >
                        Discover Amazing
                        <br />
                        Events Near You
                      </h1>

                      <p
                        className="
text-slate-300
text-xl
mt-6
leading-8
"
                      >
                        Concerts, Workshops, Festivals, Conferences and
                        unforgettable experiences.
                      </p>
                    </div>

                    <div className="flex gap-16 mt-14">
                      <div>
                        <h2 className="text-5xl font-black text-white">
                          {events.length}+
                        </h2>

                        <p className="text-slate-300">Events</p>
                      </div>

                      <div>
                        <h2 className="text-5xl font-black text-white">10K+</h2>

                        <p className="text-slate-300">Tickets Sold</p>
                      </div>

                      <div>
                        <h2 className="text-5xl font-black text-white">4.9★</h2>

                        <p className="text-slate-300">Rating</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {showMenu && (
                <div
                  className="absolute top-6
right-10
z-50
w-80
bg-white
rounded-3xl
shadow-2xl
border
overflow-hidden
"
                >
                  <div
                    className="
bg-gradient-to-r
from-indigo-600
to-purple-600
p-6
text-white
"
                  >
                    <div
                      className="
w-16
h-16
rounded-full
bg-white
text-indigo-700
flex
items-center
justify-center
font-bold
text-2xl
mb-4
"
                    >
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <h2 className="text-xl font-bold">{user?.name}</h2>

                    <p>{user?.role}</p>
                  </div>

                  <div className="p-5 space-y-4">
                    <p>📧 {user?.email}</p>

                    <p>📱 {user?.phoneNumber}</p>

                    {user?.role === "USER" && (
                      <button
                        onClick={() => router.push("/dashboard/my-tickets")}
                        className="w-full text-left hover:text-indigo-600"
                      >
                        🎫 My Tickets
                      </button>
                    )}

                    {user?.role === "USER" && (
                      <button
                        onClick={() =>
                          router.push("/dashboard/my-transactions")
                        }
                        className="w-full text-left hover:text-indigo-600"
                      >
                        💳 My Transactions
                      </button>
                    )}

                    <button
                      onClick={() => router.push("/logout")}
                      className="
w-full
text-left
text-red-600
font-semibold
"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className="
  bg-white/80
  backdrop-blur-lg
  rounded-3xl
  shadow-xl
  border
  border-white/50
  p-6
  mb-8
"
        >
          <div
            className="
  bg-white/80
  backdrop-blur-lg
  rounded-3xl
  shadow-xl
  border
  border-white/50
  p-6
  mb-8
"
          >
            <div className="flex flex-wrap gap-4 items-center">
              <div
                className="
  bg-white/80
  backdrop-blur-lg
  rounded-3xl
  shadow-xl
  border
  border-white/50
  p-6
  mb-8
"
              >
                <div className="flex flex-wrap gap-4 items-center">
                  {/* Search */}
                  <div className="relative flex-1 min-w-[300px]">
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="
          w-full
          pl-12
          pr-5
          py-4
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-sm
          focus:ring-4
          focus:ring-indigo-200
          focus:border-indigo-500
          outline-none
        "
                    />

                    <div
                      className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-gray-400
          text-xl
        "
                    >
                      🔍
                    </div>
                  </div>

                  {/* Admin / Organizer Controls */}
                  {(user?.role === "ADMIN" || user?.role === "ORGANIZER") && (
                    <>
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="
            px-5
            py-4
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-sm
            focus:ring-4
            focus:ring-indigo-200
          "
                      >
                        <option value="approved">✅ Approved</option>

                        <option value="unapproved">⏳ Pending</option>
                      </select>

                      <Link
                        href="/dashboard/categories"
                        className="
            //bg-gradient-to-r
            // from-cyan-500
            // to-blue-600
            //text-white
            px-6
            py-4
            rounded-2xl
            font-semibold
            shadow-lg
            hover:scale-105
            transition
          "
                      >
                        📂 Categories
                      </Link>

                      {canCreate && (
                        <Link
                          href="/dashboard/events/create"
                          className="
              //bg-gradient-to-r
              // from-indigo-600
              // to-purple-600
              //text-white
              px-6
              py-4
              rounded-2xl
              font-semibold
              shadow-lg
              hover:scale-105
              transition
            "
                        >
                          ➕ Create Event
                        </Link>
                      )}
                    </>
                  )}

                  {/* User Category Filter */}
                  {user?.role === "USER" && (
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="
          px-5
          py-4
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-sm
          focus:ring-4
          focus:ring-indigo-200
        "
                    >
                      <option value="">🎭 All Categories</option>

                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {events.length === 0 ? (
          <div
            className="
bg-white
rounded-[30px]
shadow-xl
p-20
text-center
"
          >
            <div className="text-7xl">🎭</div>

            <h2
              className="
text-3xl
font-bold
mt-6
"
            >
              No Events Found
            </h2>

            <p className="text-gray-500 mt-3">
              Try searching another category or create a new event.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="
bg-white/90
backdrop-blur-lg
rounded-3xl
shadow-xl
border
border-gray-100
p-6
hover:-translate-y-2
hover:shadow-2xl
transition-all
duration-300
"
              >
                <div className="relative h-64 overflow-hidden">
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.name}
                      className="
w-full
h-full
object-cover
group-hover:scale-110
transition-transform
duration-700
"
                    />
                  ) : (
                    <img
                      src="/images/default-event.png"
                      alt="Default Event"
                      className="
w-full
h-full
object-cover
"
                    />
                  )}

                  <div
                    className="
absolute
top-5
left-5
"
                  >
                    <span
                      className="
bg-white/95
backdrop-blur-md
px-4
py-2
rounded-full
font-semibold
text-indigo-700
shadow
"
                    >
                      🎵 {event.category?.name}
                    </span>
                  </div>

                  <div
                    className="
absolute
top-5
right-5
"
                  >
                    <span
                      className="
bg-orange-500
text-white
px-4
py-2
rounded-full
font-bold
shadow-lg
"
                    >
                      From ₹{event.schedule?.[0]?.price}
                    </span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {event.name}
                </h2>

                <p className="text-gray-600 mb-4">{event.description}</p>

                <div className="space-y-2 text-sm text-gray-500">
                  <p>
                    Category:{" "}
                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                      {event.category?.name}
                    </span>
                  </p>

                  <p>Organizer: {event.organizer?.name}</p>

                  <p>Schedules: {event.schedule?.length}</p>
                </div>

                {event.schedule?.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <h3 className="font-semibold mb-2">Upcoming Schedules</h3>

                    {event.schedule.slice(0, 6).map((schedule: any) => (
                      <div
                        key={schedule.id}
                        onClick={() => {
                          if (
                            user?.role === "USER" &&
                            schedule.availableSeats > 0
                          ) {
                            handleBookTicket(schedule);
                          }
                        }}
                        className={`
    border
    rounded-2xl
    p-4
    mb-3
    shadow-sm
    transition-all
    duration-300

    ${
      schedule.availableSeats > 0
        ? `
          bg-green-50
          border-green-300
          cursor-pointer
          hover:shadow-lg
          hover:scale-[1.02]
        `
        : `
          bg-gray-100
          border-gray-300
          opacity-100
          // blur-[1px]
          cursor-not-allowed
        `
    }
  `}
                      >
                        <p>
                          Date: {new Date(schedule.date).toLocaleDateString()}
                        </p>

                        <p>Time: {schedule.time}</p>

                        <p>Price: ₹{schedule.price}</p>

                        <div className="my-2">
                          {schedule.availableSeats > 0 ? (
                            <span
                              className="
      px-3
      py-1
      rounded-full
      bg-green-100
      text-green-700
      text-xs
      font-semibold
      "
                            >
                              Available
                            </span>
                          ) : (
                            <span
                              className="
      px-3
      py-1
      rounded-full
      bg-red-100
      text-red-700
      text-xs
      font-semibold
      "
                            >
                              SOLD OUT
                            </span>
                          )}
                        </div>

                        <p className="font-semibold">
                          Available Seats:
                          <span
                            className={
                              schedule.availableSeats > 10
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {" "}
                            {schedule.availableSeats}
                          </span>
                        </p>

                        <p>
                          Address:
                          {schedule.address[0].address}
                        </p>

                        {schedule.availableSeats > 0 ? (
                          <p className="mt-3 text-sm text-green-700 font-medium">
                            Click this schedule to book tickets
                          </p>
                        ) : (
                          <p className="mt-3 text-sm text-red-600 font-medium">
                            Fully booked
                          </p>
                        )}
                        {user?.role === "ORGANIZER" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadBookings(schedule);
                            }}
                            className="
      mt-3
      w-full
      bg-gradient-to-r
      from-blue-600
      to-cyan-600
      text-white
      py-2
      rounded-xl
      font-medium
      hover:scale-[1.02]
      transition-all
    "
                          >
                            📥 Download Bookings
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {(canEditEvent(event) ||
                  canCancelEvent(event) ||
                  canApproveEvent(event)) && (
                  <div className="flex gap-2 mt-5 flex-wrap">
                    {canEditEvent(event) && (
                      <Link
                        href={`/dashboard/events/edit/${event.id}`}
                        className="
flex-1
text-center
bg-gradient-to-r
from-green-500
to-emerald-600
text-white
py-3
rounded-xl
font-medium
"
                      >
                        Edit
                      </Link>
                    )}

                    {canCancelEvent(event) && (
                      <button
                        onClick={() => handleCancelEvent(event.id)}
                        className="
flex-1
bg-gradient-to-r
from-red-500
to-red-700
text-white
py-3
rounded-xl
font-medium
"
                      >
                        Cancel
                      </button>
                    )}

                    {canApproveEvent(event) && (
                      <button
                        onClick={() => handleApproveEvent(event.id)}
                        className="
flex-1
bg-gradient-to-r
from-blue-500
to-indigo-600
text-white
py-3
rounded-xl
font-medium
"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className="
  bg-white
  rounded-3xl
  shadow-2xl
  p-8
  w-[420px]
  border
  border-gray-100
"
            >
              <h2 className="text-2xl font-bold mb-6">Book Ticket</h2>

              <div className="space-y-3 mb-6">
                <p>
                  Price Per Ticket:
                  <span className="font-bold text-green-600">
                    ₹{selectedSchedule?.price}
                  </span>
                </p>

                <p>
                  Available Seats:
                  <span className="font-bold text-green-600">
                    {remainingSeats}
                  </span>
                </p>
              </div>

              <label className="block mb-2 font-medium">Number of Seats</label>

              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setSeatCount((prev) => Math.max(1, prev - 1))}
                  className="
  w-12 h-12
  bg-red-500
  text-white
  rounded-xl
  "
                >
                  -
                </button>

                <input
                  type="number"
                  min={1}
                  max={totalAvailableSeats}
                  value={seatCount}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (!value) {
                      setSeatCount(1);
                      return;
                    }

                    if (value > totalAvailableSeats) {
                      toast.error(
                        `Only ${totalAvailableSeats} seats available`,
                      );

                      setSeatCount(totalAvailableSeats);
                      return;
                    }

                    setSeatCount(value);
                  }}
                  className="
  flex-1
  border
  p-3
  rounded-lg
  text-center
  "
                />

                <button
                  onClick={() => {
                    if (seatCount < totalAvailableSeats) {
                      setSeatCount(seatCount + 1);
                    } else {
                      toast.error("Not enough seats available");
                    }
                  }}
                  disabled={seatCount >= totalAvailableSeats}
                  className="
  w-12 h-12
  bg-green-600
  text-white
  rounded-xl
  disabled:bg-gray-300
  "
                >
                  +
                </button>

                {Number(seatCount) >= totalAvailableSeats && (
                  <p className="text-red-600 text-sm">
                    Maximum available seats reached
                  </p>
                )}
              </div>

              <div className="bg-indigo-50 rounded-xl p-4 mb-6">
                <p className="text-gray-600">Total Amount</p>

                <p className="text-3xl font-bold text-indigo-700">
                  ₹{totalPrice}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="
      flex-1
      bg-gray-300
      py-3
      rounded-xl
      font-medium
      hover:bg-gray-400
    "
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBooking}
                  disabled={seatCount > totalAvailableSeats || seatCount <= 0}
                  className="
  flex-1
  bg-gradient-to-r
  from-indigo-600
  to-purple-600
  text-white
  py-3
  rounded-xl
  font-medium
  disabled:bg-gray-400
  disabled:cursor-not-allowed
  "
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-3xl shadow-2xl w-[420px] p-8">
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-red-500 hover:text-white transition"
            >
              ✕
            </button>

            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>

              <h2 className="text-3xl font-bold text-green-600">
                Ticket Confirmed
              </h2>

              <p className="mt-4 text-gray-600">
                Your booking has been completed successfully.
              </p>

              <button
                onClick={() => downloadTicket(tickerId)}
                className="mt-8 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition"
              >
                📥 Download Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
