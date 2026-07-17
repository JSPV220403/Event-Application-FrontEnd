"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.replace("/login");
  }, [router]);

  return (
  <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-100 flex items-center justify-center px-4">

    <div className="bg-white/80 backdrop-blur-lg border border-white/50 shadow-2xl rounded-3xl p-10 w-full max-w-md text-center">

      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-4xl text-white shadow-lg animate-pulse">
        👋
      </div>

      <h1 className="text-3xl font-bold text-slate-800 mb-3">
        Logging Out
      </h1>

      <p className="text-slate-500 mb-8">
        Please wait while we securely sign you out...
      </p>

      <div className="flex justify-center">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

    </div>

  </div>
);
}