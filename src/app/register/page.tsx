"use client";

import { useState,useEffect } from "react";

import { useRouter } from "next/navigation";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter()

   useEffect(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }, []);

  const [formData, setFormData] = useState({
    name: "",
    gender: "MALE",
    phone_number: "",
    email: "",
    password: "",
    role: "USER",
    address: "",
    pincode: "",
  });

const [showPassword, setShowPassword] =
  useState(false);

const [showPasswordRequirements,
  setShowPasswordRequirements] =
  useState(false);

  const passwordChecks = {
    minLength: formData.password.length >= 8,
    lowercase: /[a-z]/.test(formData.password),
    uppercase: /[A-Z]/.test(formData.password),
    number: /\d/.test(formData.password),
    symbol: /[^A-Za-z0-9]/.test(formData.password),
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
  const isPasswordValid =
    passwordChecks.minLength &&
    passwordChecks.lowercase &&
    passwordChecks.uppercase &&
    passwordChecks.number &&
    passwordChecks.symbol;

  if (
    showPasswordRequirements &&
    isPasswordValid
  ) {
    setShowPasswordRequirements(false);
  }
}, [
  formData.password,
  showPasswordRequirements,
]);

 const handleSubmit = async (
  e: React.FormEvent
) => {
  e.preventDefault();
  const isPasswordValid =
  passwordChecks.minLength &&
  passwordChecks.lowercase &&
  passwordChecks.uppercase &&
  passwordChecks.number &&
  passwordChecks.symbol;

if (!isPasswordValid) {
  setShowPasswordRequirements(true);

  toast.error(
    "Password does not meet requirements"
  );

  return;
}


  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    console.log(data);

if (data.status === 200) {
  toast.success(data.message);
} else {
  toast.error(data.message);
}
    if (data.status === 200) {
      router.push("/login");
    }
    
  } catch (error) {
    console.log(error);
  }

};

  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 flex items-center justify-center px-4 py-10">
    <div className="w-full max-w-3xl">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white p-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800">
            Create Account
          </h1>

          <p className="text-slate-500 mt-2">
            Join the Event Booking Platform
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Full Name
                  <span className="text-red-500 ml-1">*</span>

              </label>

              <input
                name="name"
                type="text"
                required
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Gender
                  <span className="text-red-500 ml-1">*</span>

              </label>

              <select
                name="gender"
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="MALE">
                  Male
                </option>

                <option value="FEMALE">
                  Female
                </option>

                <option value="OTHER">
                  Other
                </option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Phone Number
                  <span className="text-red-500 ml-1">*</span>

              </label>

              <input
                name="phone_number"
                type="text"
                onChange={handleChange}
                placeholder="+91 9876543210"
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Email Address
                  <span className="text-red-500 ml-1">*</span>

              </label>

              <input
                name="email"
                type="email"
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Password
                <span className="text-red-500 ml-1">*</span>

            </label>

            <div className="relative">

  <input
    name="password"
    type={
      showPassword
        ? "text"
        : "password"
    }
    onChange={handleChange}
    placeholder="••••••••"
    required
    className="
    w-full
    border
    border-slate-300
    rounded-xl
    px-4
    py-3
    pr-12
    focus:outline-none
    focus:ring-2
    focus:ring-indigo-500
    transition
    "
  />

  <button
    type="button"
    onClick={() =>
      setShowPassword(
        !showPassword
      )
    }
    className="
    absolute
    right-4
    top-1/2
    -translate-y-1/2
    text-gray-500
    "
  >
    {showPassword ? (
      <FaEye/>
    ) : (
      <FaEyeSlash />
    )}
  </button>

</div>
 
{
  showPasswordRequirements && (
    <div className="mt-3 space-y-1 text-sm">

      <p className={
        passwordChecks.minLength
          ? "text-green-600"
          : "text-red-600"
      }>
        {passwordChecks.minLength
          ? "✅"
          : "❌"}{" "}
        Minimum 8 characters
      </p>

      <p className={
        passwordChecks.lowercase
          ? "text-green-600"
          : "text-red-600"
      }>
        {passwordChecks.lowercase
          ? "✅"
          : "❌"}{" "}
        One lowercase letter
      </p>

      <p className={
        passwordChecks.uppercase
          ? "text-green-600"
          : "text-red-600"
      }>
        {passwordChecks.uppercase
          ? "✅"
          : "❌"}{" "}
        One uppercase letter
      </p>

      <p className={
        passwordChecks.number
          ? "text-green-600"
          : "text-red-600"
      }>
        {passwordChecks.number
          ? "✅"
          : "❌"}{" "}
        One number
      </p>

      <p className={
        passwordChecks.symbol
          ? "text-green-600"
          : "text-red-600"
      }>
        {passwordChecks.symbol
          ? "✅"
          : "❌"}{" "}
        One special character
      </p>

    </div>
  )
}
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Account Type
                <span className="text-red-500 ml-1">*</span>

            </label>

            <select
              name="role"
              required
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="USER">
                User
              </option>

              <option value="ORGANIZER">
                Organizer
              </option>

              <option value="ADMIN">
                Admin
              </option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Address
                <span className="text-red-500 ml-1">*</span>

            </label>

            <input
              name="address"
              type="text"
              required
              onChange={handleChange}
              placeholder="Enter your address"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Pincode
                <span className="text-red-500 ml-1">*</span>

            </label>

            <input
              name="pincode"
              type="text"
              required
              onChange={handleChange}
              placeholder="600001"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:scale-[1.02] transition"
          >
            Create Account
          </button>

          <div className="text-center text-slate-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  </div>
);

}