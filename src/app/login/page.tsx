"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";

import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const { refreshUser } = useAuth();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            formData
          ),
        }
      );

     
      const data =
        await response.json();

      console.log(data);
      

      if (
        data.success ||
        data.status === 200
      ) {
        localStorage.setItem(
          "token",
          data.token
        );

        refreshUser();

        toast.success(
          "Login Successful"
        );

        const decoded: any = jwtDecode(data.token);

        if (decoded.role === "ADMIN") {
          router.push("/dashboard/approvals")
        }
        else{
          router.push(
            "/dashboard/events"
          );
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        "Something went wrong"
      );
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 flex items-center justify-center px-4">

    <div className="w-full max-w-md">

      <div className="bg-white/80 backdrop-blur-lg border border-white/50 shadow-2xl rounded-3xl p-8">

        <div className="text-center mb-8">

          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 flex items-center justify-center text-white text-3xl shadow-lg">
            🎟️
          </div>

          <h1 className="text-4xl font-extrabold text-slate-800">
            Welcome Back
          </h1>

          <p className="text-slate-500 mt-2">
            Login to access your events and bookings
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>

            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div>

            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            Login
          </button>

          <div className="text-center pt-3">

            <span className="text-slate-500">
              Don't have an account?
            </span>

            <Link
              href="/register"
              className="ml-2 text-indigo-600 font-semibold hover:text-indigo-800"
            >
              Register
            </Link>

          </div>

        </form>

      </div>

      <p className="text-center text-slate-500 mt-6 text-sm">
        Event Booking Management System
      </p>

    </div>

  </div>
);

}