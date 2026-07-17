"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCategories } from "@/services/category.service";
import toast from "react-hot-toast";
import {
  getEventById,
  updateEvent,
} from "@/services/event.service";

interface Schedule {
  id?: string;
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

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = params.id as string;

  useEffect(() => {
    const token= localStorage.getItem("token");
    if(!token){
      router.replace("/login")
    }
    
  }, []);

  const [loading, setLoading] =
    useState(true);

  const [eventData, setEventData] =
    useState({
      id: "",
      name: "",
      description: "",
      category_id: "",
    });

const [image, setImage] = useState<File | null>(null);

const [existingImage, setExistingImage] = useState("");

  const [schedules, setSchedules] =
    useState<Schedule[]>([]);

  const [categories, setCategories] =
  useState<Category[]>([]);

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
    loadCategories()
  }, [eventId]);

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

  const loadEvent = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const result =
        await getEventById(
          eventId,
          token || ""
        );

      const event = result.data;

      console.log(event)

      setEventData({
        id: event.id,
        name: event.name || "",
        description:
          event.description || "",
        category_id:
          event.category_id ||
          "",
      });

      setExistingImage(event.image_url || "");
      console.log("Existing Image: ", existingImage);

      setSchedules(
        event.schedule.map(
          (schedule: any) => ({
            id: schedule.id,
            date:
              schedule.date?.split(
                "T"
              )[0] || "",
            time: schedule.time || "",
            price:
              schedule.price?.toString() ||
              "",
            venue_capacity:
              schedule.venue_capacity?.toString() ||
              "",
          address: schedule.address[0]?.address || "",

          pincode: schedule.address[0]?.pincode || "",
          })
        )
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load event");
    } finally {
      setLoading(false);
    }
  };

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
    const updatedSchedules = [
      ...schedules,
    ];

    updatedSchedules[index] = {
      ...updatedSchedules[index],
      [field]: value,
    };

    setSchedules(updatedSchedules);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("token");

      // const payload = {
      //   id: eventData.id,
      //   name: eventData.name,
      //   description:
      //     eventData.description,
      //   category_id: 
      //     eventData.category_id
      //   ,

      //   schedules: schedules.map(
      //     (schedule) => ({
      //       ...(schedule.id && {
      //         id: schedule.id,
      //       }),

      //       date: schedule.date,
      //       time: schedule.time,

      //       price: Number(
      //         schedule.price
      //       ),

      //       venue_capacity: Number(
      //         schedule.venue_capacity
      //       ),

      //       address:
      //         schedule.address,

      //       pincode:
      //         schedule.pincode,
      //     })
      //   ),
      // };

      const formData = new FormData();

formData.append("id", eventData.id);
formData.append("name", eventData.name);
formData.append("description", eventData.description);
formData.append("category_id", eventData.category_id);

if (image) {
  formData.append("image", image);
}

formData.append(
  "schedules",
  JSON.stringify(
    schedules.map((schedule) => ({
      ...(schedule.id && { id: schedule.id }),
      date: schedule.date,
      time: schedule.time,
      price: Number(schedule.price),
      venue_capacity: Number(schedule.venue_capacity),
      address: schedule.address,
      pincode: schedule.pincode,
    }))
  )
);

const result = await updateEvent(
  formData,
  token || ""
);

      // const result =
      //   await updateEvent(
      //     payload,
      //     token || ""
      //   );

if (result.status === 200) {
  toast.success(result.message);
} else {
  toast.error(result.message);
}
      router.push(
        "/dashboard/events"
      );
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };

  if (loading) {
   
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

        <p className="mt-4 text-gray-600">
          Loading Event...
        </p>

      </div>
    </div>
  );
}
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
  <h1 className="text-4xl font-bold text-gray-800">
    Update Event
  </h1>

  <p className="text-gray-500 mt-2">
    Modify event details and schedules.
  </p>
</div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="block mb-2 font-medium">
              Event Name
            </label>

            <input
              type="text"
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
              value={eventData.name}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              rows={4}
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
              value={
                eventData.description
              }
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  description:
                    e.target.value,
                })
              }
            />
          </div>
          <div>
  <label className="block mb-2 font-medium">
    Category
  </label>

  <select
    value={eventData.category_id}
    onChange={(e) =>
      setEventData({
        ...eventData,
        category_id:
          e.target.value,
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
    <option value="">
      Select Category
    </option>

    {categories.map(
      (category) => (
        <option
          key={category.id}
          value={category.id}
        >
          {category.name}
        </option>
      )
    )}
  </select>
</div>
<div>
  <label className="block mb-2 font-medium">
    Event Image
  </label>

  {existingImage && !image && (
    <div className="mb-4">
      <img
        src={existingImage}
        alt="Event"
        className="w-full h-64 object-cover rounded-xl border"
      />
    </div>
  )}

  {image && (
    <div className="mb-4">
      <img
        src={URL.createObjectURL(image)}
        alt="Preview"
        className="w-full h-64 object-cover rounded-xl border"
      />
    </div>
  )}

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      if (e.target.files?.length) {
        setImage(e.target.files[0]);
      }
    }}
    className="
      w-full
      border
      border-gray-200
      bg-white
      p-4
      rounded-xl
    "
  />
</div>

          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Schedules
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

          {schedules.map(
            (schedule, index) => (
              <div
                key={index}
                className="
bg-white
border
border-gray-200
rounded-2xl
p-6
space-y-4
shadow-md
hover:shadow-xl
transition-all
"
              >
                <div className="flex justify-between">
                  <h3 className="text-lg font-bold text-indigo-700">
                    Schedule {index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      removeSchedule(
                        index
                      )
                    }
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
                </div>

                <input
                  type="date"
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
                  value={schedule.date}
                  onChange={(e) =>
                    handleScheduleChange(
                      index,
                      "date",
                      e.target.value
                    )
                  }
                />

                <input
                  type="time"
                  className="w-full border p-3 rounded-lg"
                  value={schedule.time}
                  onChange={(e) =>
                    handleScheduleChange(
                      index,
                      "time",
                      e.target.value
                    )
                  }
                />

                <input
                  type="number"
                  placeholder="Price"
                  className="w-full border p-3 rounded-lg"
                  value={schedule.price}
                  onChange={(e) =>
                    handleScheduleChange(
                      index,
                      "price",
                      e.target.value
                    )
                  }
                />

                <input
                  type="number"
                  placeholder="Venue Capacity"
                  className="w-full border p-3 rounded-lg"
                  value={
                    schedule.venue_capacity
                  }
                  onChange={(e) =>
                    handleScheduleChange(
                      index,
                      "venue_capacity",
                      e.target.value
                    )
                  }
                />

                <input
                  type="text"
                  placeholder="Address"
                  className="w-full border p-3 rounded-lg"
                  value={schedule.address}
                  onChange={(e) =>
                    handleScheduleChange(
                      index,
                      "address",
                      e.target.value
                    )
                  }
                />

                <input
                  type="text"
                  placeholder="Pincode"
                  className="w-full border p-3 rounded-lg"
                  value={schedule.pincode}
                  onChange={(e) =>
                    handleScheduleChange(
                      index,
                      "pincode",
                      e.target.value
                    )
                  }
                />
              </div>
            )
          )}

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
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
}