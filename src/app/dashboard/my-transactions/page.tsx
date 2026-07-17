"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function MyTransactionsPage() {
  const router = useRouter();

  const [transactions, setTransactions] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    loadTransactions();
  }, []);

  const loadTransactions =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await fetch(
            "http://localhost:8000/api/user/myTransactions",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const result =
          await response.json();

        if (
          result.status === 200
        ) {
          setTransactions(
            result.data || []
          );
        } else {
          toast.error(
            result.message
          );
        }
      } catch (error) {
        console.error(error);
        toast.error(
          "Unable to load transactions"
        );
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl">
          <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto" />

          <p className="mt-4 text-slate-600 font-medium">
            Loading transactions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-800">
            💳 My Transactions
          </h1>

          <p className="text-slate-500 mt-2">
            View your complete payment
            history
          </p>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200 p-16 text-center">
            <div className="text-7xl mb-4">
              💳
            </div>

            <h2 className="text-2xl font-bold text-slate-700">
              No Transactions Found
            </h2>

            <p className="text-slate-500 mt-2">
              You don't have any
              transactions yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {transactions.map(
              (transaction) => (
                <div
                  key={
                    transaction.transactionId
                  }
                  className="
                    bg-white/90
                    backdrop-blur-sm
                    border
                    border-slate-200
                    rounded-3xl
                    shadow-lg
                    hover:shadow-2xl
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    overflow-hidden
                  "
                >
                  {/* Top Strip */}
                  <div
                    className={`
                      h-2
                      ${
                        transaction.status ===
                        "SUCCESS"
                          ? "bg-green-500"
                          : transaction.status ===
                            "FAILED"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }
                    `}
                  />

                  <div className="p-6">

                    {/* Event Name */}
                    <div className="flex justify-between items-start mb-5">
                      <h2 className="text-2xl font-bold text-slate-800">
                        {
                          transaction.eventName
                        }
                      </h2>

                      <span
                        className={`
                          text-xs
                          font-semibold
                          px-3
                          py-1
                          rounded-full

                          ${
                            transaction.status ===
                            "SUCCESS"
                              ? `
                                bg-green-100
                                text-green-700
                              `
                              : transaction.status ===
                                "FAILED"
                              ? `
                                bg-red-100
                                text-red-700
                              `
                              : `
                                bg-yellow-100
                                text-yellow-700
                              `
                          }
                        `}
                      >
                        {
                          transaction.status
                        }
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 text-sm">

                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Amount
                        </span>

                        <span className="font-semibold text-slate-800">
                          ₹
                          {
                            transaction.amount
                          }
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Seats
                        </span>

                        <span className="font-semibold text-slate-800">
                          {
                            transaction.seat
                          }
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Event Date
                        </span>

                        <span className="font-semibold text-slate-800">
                          {
                            transaction.eventDate
                          }
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Event Time
                        </span>

                        <span className="font-semibold text-slate-800">
                          {
                            transaction.eventTime
                          }
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Address
                        </span>

                        <span className="font-semibold text-slate-800 text-right">
                          {
                            transaction.address
                          }
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Transaction Date
                        </span>

                        <span className="font-semibold text-slate-800">
                          {
                            transaction.transactionCreatedAt
                          }
                        </span>
                      </div>

                    </div>

                    {/* Transaction IDs */}
                    <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-2">

                      <div>
                        <p>
                          Order ID
                        </p>

                        <p className="font-medium break-all">
                          {
                            transaction.orderId
                          }
                        </p>
                      </div>

                      <div>
                        <p>
                          Transaction ID
                        </p>

                        <p className="font-medium break-all">
                          {
                            transaction.transactionId
                          }
                        </p>
                      </div>

                    </div>

                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}