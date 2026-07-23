"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/services/event.service";
import { useAuth } from "@/hooks/useAuth";
import { getCategories } from "@/services/category.service";
import toast from "react-hot-toast";

interface Schedule {
  date: string;
  time: string;
  price: string;
  venue_capacity: string;
  address: string;
  pincode: string;
}

interface Category {
  id: number;
  name: string;
}

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login")
    }

  }, []);
  const [authorized, setAuthorized] =
    useState(false);

  const [eventData, setEventData] =
    useState({
      name: "",
      description: "",
      category_id: "",
    });


  const [categories, setCategories] =
    useState<Category[]>([]);

  const [eventImage, setEventImage] =
    useState<File | null>(null);

  const loadCategories = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const result =
        await getCategories(
          token || ""
        );

      setCategories(
        result.data || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const [schedules, setSchedules] =
    useState<Schedule[]>([
      {
        date: "",
        time: "",
        price: "",
        venue_capacity: "",
        address: "",
        pincode: "",
      },
    ]);

  useEffect(() => {
    if (!user) return;

    const canCreateEvent =
      (user.role === "ADMIN" ||
        user.role === "ORGANIZER") &&
      user.status !== "PENDING";

    if (!canCreateEvent) {
      toast.error(
        "You are not authorized to create events"
      );

      router.push("/dashboard/events");
      return;
    }

    setAuthorized(true);
  }, [user, router]);



  const addSchedule = () => {
    setSchedules([
      ...schedules,
      {
        date: "",
        time: "",
        price: "",
        venue_capacity: "",
        address: "",
        pincode: "",
      },
    ]);
  };

  const removeSchedule = (
    index: number
  ) => {
    if (schedules.length === 1)
      return;

    setSchedules(
      schedules.filter(
        (_, i) => i !== index
      )
    );
  };

  const handleScheduleChange = (
    index: number,
    field: keyof Schedule,
    value: string
  ) => {
    const updated = [...schedules];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setSchedules(updated);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("token");
      console.log("Event Data: ", eventData)
      console.log(
        "category_id before conversion",
        eventData.category_id
      );
 
      const formData =
        new FormData();

      formData.append(
        "name",
        eventData.name
      );

      formData.append(
        "description",
        eventData.description
      );

      formData.append(
        "category_id",
        eventData.category_id
      );

      if (eventImage) {
        formData.append(
          "image",
          eventImage
        );
      }

      formData.append(
        "schedules",
        JSON.stringify(
          schedules.map(
            (schedule) => ({
              ...schedule,
              price: Number(
                schedule.price
              ),
              venue_capacity:
                Number(
                  schedule.venue_capacity
                ),
            })
          )
        )
      );

      const result =
        await createEvent(
          formData,
          token || ""
        );

      if (result.status === 200) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      if (result.status === 200) {
        router.push(
          "/dashboard/events"
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to create event"
      );
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100">
        <div className="text-center">

          <div className="
        w-14
        h-14
        border-4
        border-indigo-600
        border-t-transparent
        rounded-full
        animate-spin
        mx-auto
        " />

          <p className="mt-4 text-gray-600">
            Loading...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 py-10 px-4">
      <div
        className="
max-w-5xl
mx-auto
bg-white/80
backdrop-blur-lg
rounded-3xl
shadow-2xl
border
border-white/50
p-10
"
      >
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800">Create Event</h1>

          <p className="text-gray-500 mt-2">
            Build amazing experiences for your audience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">
              Event Poster
              <span className="text-red-500 ml-1">*</span>
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setEventImage(e.target.files[0]);
                }
              }}
              className="
      w-full
      border
      border-gray-200
      bg-white
      p-4
      rounded-xl
      focus:outline-none
      focus:ring-2
      focus:ring-indigo-500
      transition
    "
              required
            />

            {eventImage && (
              <img
                src={URL.createObjectURL(eventImage)}
                alt="preview"
                className="
        mt-4
        w-full
        max-h-64
        object-cover
        rounded-xl
        border
      "
              />
            )}
          </div>
          <div>
            <label className="block mb-2 font-medium">
              Event Name
              <span className="text-red-500 ml-1">*</span>
            </label>

            <input
              type="text"
              value={eventData.name}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  name: e.target.value,
                })
              }
              className="
w-full
border
border-gray-200
bg-white
p-4
rounded-xl
focus:outline-none
focus:ring-2
focus:ring-indigo-500
focus:border-transparent
transition
"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Description
              <span className="text-red-500 ml-1">*</span>
            </label>

            <textarea
              rows={4}
              value={eventData.description}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  description: e.target.value,
                })
              }
              className="
w-full
border
border-gray-200
bg-white
p-4
rounded-xl
focus:outline-none
focus:ring-2
focus:ring-indigo-500
focus:border-transparent
transition
"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">
              Category
              <span className="text-red-500 ml-1">*</span>
            </label>

            <select
              value={eventData.category_id}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  category_id: e.target.value,
                })
              }
              className="
w-full
border
border-gray-200
bg-white
p-4
rounded-xl
focus:outline-none
focus:ring-2
focus:ring-indigo-500
focus:border-transparent
transition
"
              required
            >
              <option value="">Select Category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Schedules
              <span className="text-red-500 ml-1">*</span>
            </h2>

            <button
              type="button"
              onClick={addSchedule}
              className="
bg-gradient-to-r
from-indigo-600
to-purple-600
text-white
px-5
py-3
rounded-xl
font-medium
shadow-lg
hover:scale-105
transition-all
"
            >
              + Add Schedule
            </button>
          </div>

          {schedules.map((schedule, index) => (
            <div
              key={index}
              className="border rounded-xl p-5 space-y-4 bg-gray-50"
            >
              <div className="flex justify-between">
                <h3 className="text-lg font-bold text-indigo-700">
                  Schedule {index + 1}
                </h3>

                {schedules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSchedule(index)}
                    className="
bg-red-500
hover:bg-red-600
text-white
px-4
py-2
rounded-xl
transition-all
"
                  >
                    Remove
                  </button>
                )}
              </div>

              <input
                type="date"
                value={schedule.date}
                onChange={(e) =>
                  handleScheduleChange(index, "date", e.target.value)
                }
                className="
w-full
border
border-gray-200
bg-white
p-4
rounded-xl
focus:outline-none
focus:ring-2
focus:ring-indigo-500
focus:border-transparent
transition
"
                required
              />

              <input
                type="time"
                value={schedule.time}
                onChange={(e) =>
                  handleScheduleChange(index, "time", e.target.value)
                }
                className="
w-full
border
border-gray-200
bg-white
p-4
rounded-xl
focus:outline-none
focus:ring-2
focus:ring-indigo-500
focus:border-transparent
transition
"
                required
              />

              <input
                type="number"
                placeholder="Price"
                value={schedule.price}
                onChange={(e) =>
                  handleScheduleChange(index, "price", e.target.value)
                }
                className="
w-full
border
border-gray-200
bg-white
p-4
rounded-xl
focus:outline-none
focus:ring-2
focus:ring-indigo-500
focus:border-transparent
transition
"
                required
              />

              <input
                type="number"
                placeholder="Venue Capacity"
                value={schedule.venue_capacity}
                onChange={(e) =>
                  handleScheduleChange(index, "venue_capacity", e.target.value)
                }
                className="w-full border p-3 rounded-lg"
                required
              />

              <input
                type="text"
                placeholder="Address"
                value={schedule.address}
                onChange={(e) =>
                  handleScheduleChange(index, "address", e.target.value)
                }
                className="w-full border p-3 rounded-lg"
                required
              />

              <input
                type="text"
                placeholder="Pincode"
                value={schedule.pincode}
                onChange={(e) =>
                  handleScheduleChange(index, "pincode", e.target.value)
                }
                className="w-full border p-3 rounded-lg"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="
w-full
bg-gradient-to-r
from-indigo-600
to-purple-600
text-white
py-4
rounded-2xl
font-semibold
text-lg
shadow-lg
hover:scale-[1.02]
transition-all
"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}