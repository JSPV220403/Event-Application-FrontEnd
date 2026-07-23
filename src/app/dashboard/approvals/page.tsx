"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import {
Select,
SelectTrigger,
SelectValue,
SelectContent,
SelectItem,
} from "@/components/ui/select";

import { getEventList } from "@/services/event.service";

import {
  getOrganizersAdminsList,
  approveEvent,
  organizerAdminApproval,
} from "@/services/admin.service";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ApprovalsPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, []);
  const [type, setType] = useState("organizer");

  const [showProfile, setShowProfile] = useState(false);

  const [status, setStatus] = useState("approved");

  const [data, setData] = useState<any[]>([]);

  const [allUsers, setAllUsers] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (type === "events") {
        const result = await getEventList(
          {
            filter: status,
          },
          token || "",
        );

        setData(result.data || []);
      } else {
        const result = await getOrganizersAdminsList({}, token || "");

        setAllUsers(result.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = allUsers.filter((user) => {
      const roleMatch = user.role.toLowerCase() === type.toLowerCase();

      const statusMatch = user.is_approved === status;

      return roleMatch && statusMatch;
    });

    setData(filtered);
  }, [allUsers, type, status]);

  const handleApproveEvent = async (eventId: string) => {
    try {
      const token = localStorage.getItem("token");

      const result = await approveEvent(eventId, token || "");

      if (result.status === 200) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");

      const result = await organizerAdminApproval(userId, token || "");

      if (result.status === 200) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      if (result.status === 200) {
        setAllUsers((prev) =>
          prev.map((item) =>
            item.id === userId
              ? {
                  ...item,
                  is_approved: "approved",
                }
              : item,
          ),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (user?.role !== "ADMIN") {
    return <div className="p-10">Unauthorized</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="bg-white rounded-2xl shadow-xl p-10">
          <div className="animate-pulse text-xl font-semibold">
            Loading approvals...
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950">
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-[140px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-500/20 blur-[180px] rounded-full" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/10 blur-[220px] rounded-full" />

      <div className="relative z-10 p-6 md:p-10"></div>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-4 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 px-4 py-2 rounded-full text-sm font-semibold">
              ⚡ Administrator Console
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-white">
              Approval Dashboard
            </h1>

            <p className="text-slate-300 mt-4 text-lg max-w-xl">
              Manage organizers, administrators and platform activities from one
              powerful control center.
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="
      w-11 h-11
      rounded-full
      bg-gradient-to-r
      from-indigo-600
      to-purple-600
      text-white
      font-bold
      text-lg
      shadow-lg
      hover:scale-105
      transition-all
      flex
      items-center
      justify-center
    "
            >
              {user?.name?.charAt(0).toUpperCase()}
            </button>
            {showProfile && (
              <div
                className="
        absolute
        right-0
        mt-4
        w-72
        bg-white/95
        backdrop-blur-md
        rounded-3xl
        shadow-2xl
        border
        border-gray-100
        overflow-hidden
        z-50
      "
              >
                <div
                  className="
          bg-gradient-to-r
          from-indigo-600
          to-purple-600
          p-6
          text-center
        "
                >
                  <div
                    className="
            w-20 h-20
            mx-auto
            rounded-full
            bg-white
            text-indigo-700
            font-bold
            text-3xl
            flex
            items-center
            justify-center
            shadow-lg
          "
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-white">
                    {user?.name}
                  </h3>

                  <span
                    className="
            inline-block
            mt-3
            px-4
            py-1
            rounded-full
            bg-white/20
            text-white
            text-sm
            font-medium
          "
                  >
                    {user?.role}
                  </span>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📧</span>

                    <div>
                      <p className="text-xs text-gray-500">Email</p>

                      <p className="font-medium text-gray-800">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xl">📞</span>

                    <div>
                      <p className="text-xs text-gray-500">Phone</p>

                      <p className="font-medium text-gray-800">
                        {user?.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,.35)] p-8 flex flex-wrap gap-8 items-end">
          <div className="relative">
            <label className="block mb-2 text-white font-semibold">Type</label>
            
            <Select
value={type}
onValueChange={setType}
>

<SelectTrigger className="w-56 h-12 rounded-2xl bg-slate-900/70 border border-cyan-500 text-white">

<SelectValue/>

</SelectTrigger>

<SelectContent
position="popper"
side="bottom"
align="start"
sideOffset={8}
className="
w-56
rounded-2xl
border
border-cyan-500/40
bg-slate-900
backdrop-blur-xl
text-white
shadow-2xl
"
>

<SelectItem value="organizer">
Organizer
</SelectItem>

<SelectItem value="admin">
Admin
</SelectItem>

</SelectContent>



</Select>

          </div>

          <div className="relative">
            <label className="block mb-2 text-white font-semibold">
              Status
            </label>

            <Select
value={status}
onValueChange={setStatus}
>

<SelectTrigger className="w-56 h-12 rounded-2xl bg-slate-900/70 border border-cyan-500 text-white">

<SelectValue/>

</SelectTrigger>

<SelectContent
position="popper"
side="bottom"
align="start"
sideOffset={8}
className="
w-56
rounded-2xl
border
border-cyan-500/40
bg-slate-900
backdrop-blur-xl
text-white
shadow-2xl
"
>
<SelectItem value="approved">
Approved
</SelectItem>

<SelectItem value="unapproved">
Unapproved
</SelectItem>

</SelectContent> 


</Select>
          </div>

          <Link
            href="/dashboard/events"
            className="px-6 py-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-xl hover:scale-105 transition-all duration-300"
          >
            Events
          </Link>

          <button
            onClick={() => router.push("/logout")}
            className="px-6 py-1 rounded-2xl bg-gradient-to-r from-rose-500 to-red-700 text-white font-bold shadow-xl hover:scale-105 transition-all duration-300"
          >
            Logout
          </button>
        </div>
        {data.length === 0 ? (
          <div
            className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-20 text-center shadow-[0_25px_70px_rgba(0,0,0,.35)]"
          >
            <div className="text-6xl mb-4">📭</div>

            <div
              className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-20 text-center shadow-[0_25px_70px_rgba(0,0,0,.35)]"
            >
              <div className="text-6xl mb-4">📭</div>

              <h2 className="text-2xl font-bold text-slate-700">
                No Records Found
              </h2>

              <p className="text-slate-500 mt-2">
                Nothing matches the selected filter.
              </p>
            </div>

            <p className="text-slate-500 mt-2">
              Nothing matches the selected filter.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {type === "events"
              ? data.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-slate-100"
                  >
                    <h2 className="text-xl font-bold text-slate-800">
                      {event.name}
                    </h2>

                    <p className="text-gray-600 mt-2">{event.description}</p>

                    <p className="mt-3 text-sm">
                      Category: {event.category?.name}
                    </p>

                    <p className="text-sm">
                      Organizer: {event.organizer?.name}
                    </p>

                    {status === "unapproved" && (
                      <button
                        onClick={() => handleApproveEvent(event.id)}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                ))
              : data.map((item) => (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,.3)] p-7 hover:-translate-y-2 hover:shadow-[0_35px_70px_rgba(59,130,246,.4)] transition-all duration-500 m-2"
                  >
                    <h2 className="text-2xl font-bold text-white">
                      {item.name}
                    </h2>

                    <p className="text-slate-300 mt-2">{item.mail}</p>

                    <div className="mt-4">
                      <span className="inline-flex px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-bold shadow-lg">
                        {item.role}
                      </span>
                    </div>
                    <p className="mt-4 text-slate-300 text-sm">
                      📞 {item.mobileNumber}
                    </p>
                    {status === "unapproved" && (
                      <button
                        onClick={() => handleApproveUser(item.id)}
                        className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 text-white font-bold text-lg shadow-xl hover:scale-[1.03] hover:shadow-green-500/40 transition-all duration-300"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                ))}
          </div>
        )}
      </div>
    </div>
  );
}
