"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

import {
  getOrganizersAdminsList,
  organizerAdminApproval,
} from "@/services/admin.service";

export default function OrganizersAdminsPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const token= localStorage.getItem("token");
    if(!token){
      router.replace("/login")
    }
    
  }, []);

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [role, setRole] =
    useState("organizer");

  const [filter, setFilter] =
    useState("approved");

  useEffect(() => {
    if (!user) return;

    if (
      user.role !== "ADMIN" ||
      user.status === "PENDING"
    ) {
      toast.error("Unauthorized");

      
      router.push(
        "/dashboard/events"
      )

      return;
    }

    loadUsers();
  }, [user]);

  useEffect(() => {
    if (
      user?.role === "ADMIN"
    ) {
      loadUsers();
    }
  }, [role, filter]);

  const loadUsers = async () => {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      const result =
        await getOrganizersAdminsList(
          {
            role,
            filter,
          },
          token || ""
        );

      setUsers(
        result.data || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser =
    async (
      userId: string
    ) => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const result =
          await organizerAdminApproval(
            userId,
            token || ""
          );
if (result.status === 200) {
  toast.success(result.message);
} else {
  toast.error(result.message);
}

        if (
          result.status === 200
        ) {
          loadUsers();
        }
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to approve user"
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
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
  <h1 className="text-4xl font-extrabold text-slate-800">
    Organizers & Admins
  </h1>

  <p className="text-slate-500 mt-2">
    Manage approvals and monitor platform users
  </p>
</div>
        {/* <div className="bg-white p-5 rounded-xl shadow mb-6 flex gap-4"> */}
        <div className="
bg-white/80
backdrop-blur-sm
border
border-slate-200
rounded-2xl
shadow-lg
p-6
mb-8
flex
gap-6
flex-wrap
">
          <div>
            <label className="block mb-2">
              Role
            </label>

            <select
              value={role}
              onChange={(e) =>
                setRole(
                  e.target.value
                )
              }
              className="border p-2 rounded"
            >
              <option value="organizer">
                Organizer
              </option>

              <option value="admin">
                Admin
              </option>
            </select>
          </div>

          <div>
            <label className="block mb-2">
              Status
            </label>

            <select
              value={filter}
              onChange={(e) =>
                setFilter(
                  e.target.value
                )
              }
              className="border p-2 rounded"
            >
              <option value="approved">
                Approved
              </option>

              <option value="unapproved">
                Unapproved
              </option>
            </select>
          </div>
        </div>

        {users.length === 0 ? (
          
          <div className="
bg-white
rounded-2xl
shadow-lg
p-16
text-center
">
  <div className="text-6xl mb-4">
    👥
  </div>

  <h3 className="text-xl font-semibold text-slate-700">
    No Users Found
  </h3>

  <p className="text-slate-500 mt-2">
    Try changing role or approval filters.
  </p>
</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(
              (item) => (
                <div
                  key={item.id}
                  // className="bg-white p-5 rounded-xl shadow"
                  className="
bg-white
border
border-slate-200
rounded-2xl
shadow-md
p-6
transition-all
duration-300
hover:shadow-xl
hover:-translate-y-1
"
                >
                  <h2 className="text-xl font-bold">
                    {item.name}
                  </h2>

                  <p className="text-gray-600">
                    {item.email}
                  </p>

                  {/* <div className="mt-4 space-y-1 text-sm"> */}
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>
                      Role:{" "}
                      {item.role}
                    </p>

                    <p>
                      Phone:{" "}
                      {item.phone}
                    </p>

                    <p>
                      User ID:{" "}
                      {item.id}
                    </p>
                  </div>

                  {filter ===
                    "unapproved" && (
                    <button
                      onClick={() =>
                        handleApproveUser(
                          item.id
                        )
                      }
                      className="
mt-5
w-full
bg-gradient-to-r
from-green-500
to-emerald-600
text-white
font-medium
py-3
rounded-xl
shadow-md
hover:shadow-lg
hover:scale-[1.02]
transition-all
duration-200
"
                    >
                      Approve User
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}