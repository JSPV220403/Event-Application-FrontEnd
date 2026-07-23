"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import { getCategories, deleteCategory } from "@/services/category.service";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const { user } = useAuth();

  const router = useRouter()

  const [categories, setCategories] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const token= localStorage.getItem("token");
    if(!token){
      router.replace("/login")
    }
    
  }, []);

  const loadCategories =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const result =
          await getCategories(
            token || ""
          );

        setCategories(
          result.data || []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const handleDeleteCategory = async (
  id: string
) => {
  const confirmed =
    window.confirm(
      "Are you sure you want to delete this category?"
    );

  if (!confirmed) return;

  try {
    const token =
      localStorage.getItem("token");

    const result =
      await deleteCategory(
        id,
        token || ""
      );

if (result.status === 200) {
  toast.success(result.message);
} else {
  toast.error(result.message);
}
    if (result.status === 200) {
      loadCategories();
    }
  } catch (error) {
    console.error(error);

    toast.error(
      "Failed to delete category"
    );
  }
};  

  

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

        <p className="mt-4 text-gray-600">
          Loading Categories...
        </p>
      </div>
    </div>
  );
}

return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-8">
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">

        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Categories
          </h1>

          <p className="text-gray-500 mt-2">
            Manage event categories across the platform
          </p>
        </div>

        {(user?.role === "ADMIN" ||
          user?.role === "ORGANIZER") &&
          user?.status === "APPROVED" && (
            <Link
              href="/dashboard/categories/create"
              className="
                bg-gradient-to-r
                from-indigo-600
                to-purple-600
                text-white
                px-6
                py-3
                rounded-xl
                font-semibold
                shadow-lg
                hover:scale-105
                transition-all
              "
            >
              + Create Category
            </Link>
          )}
      </div>

      {/* Stats Card */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 mb-8 border border-white/50">
        <div className="flex items-center justify-between">

          <div>
            <p className="text-gray-500 text-sm">
              Total Categories
            </p>

            <h2 className="text-4xl font-bold text-indigo-600">
              {categories.length}
            </h2>
          </div>

          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-3xl">
            📂
          </div>

        </div>
      </div>

      {/* Empty State */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xl p-16 text-center">

          <div className="text-6xl mb-4">
            📭
          </div>

          <h2 className="text-2xl font-bold text-gray-700">
            No Categories Found
          </h2>

          <p className="text-gray-500 mt-2">
            Create your first category to get started.
          </p>

        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {categories.map((category) => (
            <div
              key={category.id}
              className="
                bg-white/80
                backdrop-blur-lg
                border
                border-white/50
                rounded-3xl
                shadow-xl
                p-6
                hover:-translate-y-2
                hover:shadow-2xl
                transition-all
                duration-300
              "
            >

              <div className="flex items-center gap-4 mb-4">

                <div className="
                  w-14
                  h-14
                  rounded-full
                  bg-gradient-to-r
                  from-indigo-500
                  to-purple-500
                  text-white
                  flex
                  items-center
                  justify-center
                  text-xl
                  font-bold
                ">
                  {category.name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-800 capitalize">
                    {category.name}
                  </h2>

                </div>
              </div>

              {(
                user?.role === "ADMIN" ||
                (
                  user?.role === "ORGANIZER" &&
                  user?.status === "APPROVED" &&
                  category.created_by === user.id
                )
              ) && (
                <div className="flex gap-3">

                  <Link
                    href={`/dashboard/categories/edit/${category.id}`}
                    className="
                      flex-1
                      text-center
                      bg-emerald-600
                      hover:bg-emerald-700
                      text-white
                      py-3
                      rounded-xl
                      font-medium
                      transition-all
                    "
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() =>
                      handleDeleteCategory(
                        category.id
                      )
                    }
                    className="
                      flex-1
                      bg-red-600
                      hover:bg-red-700
                      text-white
                      py-3
                      rounded-xl
                      font-medium
                      transition-all
                    "
                  >
                    Delete
                  </button>

                </div>
              )}

            </div>
          ))}

        </div>
      )}
    </div>
  </div>
);

}