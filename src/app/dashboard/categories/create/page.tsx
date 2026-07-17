"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { createCategory } from "@/services/category.service";

export default function CreateCategoryPage() {
  const router = useRouter();

  const { user } = useAuth();

  const [name, setName] = useState("");

  const [loading, setLoading] =
    useState(false);
useEffect(() => {
    const token= localStorage.getItem("token");
    if(!token){
      router.replace("/login")
    }
    
  }, []);
  useEffect(() => {
    if (!user) return;

    const allowed =
      (user.role === "ADMIN" ||
        user.role === "ORGANIZER") &&
      user.status !== "PENDING";

    if (!allowed) {
      router.push(
        "/dashboard/events"
      );
    }
  }, [user, router]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const result =
        await createCategory(
          {
            name,
          },
          token || ""
        );

if (result.status === 200) {
  toast.success(result.message);
} else {
  toast.error(result.message);
}
      if (result.status === 200) {
        setName("");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to create category"
      );
    } finally {
      setLoading(false);
    }
  };

   return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-6">
    <div className="w-full max-w-2xl">

      <div className="bg-white/80 backdrop-blur-lg border border-white/50 rounded-3xl shadow-2xl p-10">

        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl shadow-lg">
            📂
          </div>

          <h1 className="text-4xl font-bold text-gray-800">
            Create Category
          </h1>

          <p className="text-gray-500 mt-2">
            Organize your events with beautiful categories
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Music, Sports, Conference..."
              required
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                bg-white
                px-4
                py-4
                text-gray-700
                outline-none
                transition-all
                duration-300
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-100
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-xl
              bg-gradient-to-r
              from-indigo-600
              to-purple-600
              py-4
              text-white
              font-semibold
              shadow-lg
              transition-all
              duration-300
              hover:scale-[1.02]
              hover:shadow-xl
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading
              ? "Creating Category..."
              : "Create Category"}
          </button>
        </form>

        <div className="mt-8 border-t pt-6 text-center">
          <p className="text-sm text-gray-500">
            Categories help users discover events faster.
          </p>
        </div>

      </div>
    </div>
  </div>
);
}