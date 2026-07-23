"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  getCategoryById,
  updateCategory,
} from "@/services/category.service";

import toast from "react-hot-toast";

export default function EditCategoryPage() {
  const params = useParams();

  const router = useRouter();

  useEffect(() => {
    const token= localStorage.getItem("token");
    if(!token){
      router.replace("/login")
    }
    
  }, []);

  const categoryId =
    String(params.id);
    console.log(categoryId)
  
    console.log(typeof(categoryId))

  const [loading, setLoading] =
    useState(true);

  const [name, setName] =
    useState("");

 useEffect(() => {
  if (params?.id) {
    loadCategory();
  }
}, [params]);

  const loadCategory =
    async () => {
      try {
          const categoryId = String(
    params.id
  );

  const token =
    localStorage.getItem("token");

  const result =
    await getCategoryById(
      categoryId,
      token || ""
    );

        if (
          result.status !== 200
        ) {
          toast.error(
            result.message
          );

          router.push(
            "/dashboard/categories"
          );

          return;
        }

        setName(
          result.data.name
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load category"
        );
      } finally {
        setLoading(false);
      }
    };

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const result =
          await updateCategory(
            {
              id: categoryId,
              name,
            },
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
          router.push(
            "/dashboard/categories"
          );
        }
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to update category"
        );
      }
    };

  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-6">
    <div className="w-full max-w-2xl">

      <div className="bg-white/80 backdrop-blur-lg border border-white/50 rounded-3xl shadow-2xl p-10">

        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white text-3xl shadow-lg">
            ✏️
          </div>

          <h1 className="text-4xl font-bold text-gray-800">
            Edit Category
          </h1>

          <p className="text-gray-500 mt-2">
            Update your category information
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
                setName(
                  e.target.value
                )
              }
              placeholder="Enter category name"
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
                focus:border-amber-500
                focus:ring-4
                focus:ring-amber-100
              "
            />
          </div>

          <div className="flex gap-4">

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard/categories"
                )
              }
              className="
                flex-1
                rounded-xl
                border
                border-gray-300
                bg-white
                py-4
                font-semibold
                text-gray-700
                hover:bg-gray-50
                transition-all
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                flex-1
                rounded-xl
                bg-gradient-to-r
                from-amber-500
                to-orange-500
                py-4
                text-white
                font-semibold
                shadow-lg
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:shadow-xl
              "
            >
              Update Category
            </button>

          </div>
        </form>

        <div className="mt-8 border-t pt-6 text-center">
          <p className="text-sm text-gray-500">
            Keep category names clear and meaningful for better event organization.
          </p>
        </div>

      </div>
    </div>
  </div>
);

}