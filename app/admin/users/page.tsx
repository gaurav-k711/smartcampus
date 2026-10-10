import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import UserManagementClient from "@/components/admin/UserManagementClient";
import { Users } from "lucide-react";

// User list changes infrequently — 30-second cache is safe
export const revalidate = 30;


export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
      createdAt: true,
      _count: {
        select: { bookings: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Campus User Accounts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Oversee student, faculty, and administrative account permissions and reservation frequencies.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs self-start sm:self-auto">
          Registered Accounts: <strong className="text-blue-600">{users.length}</strong>
        </div>
      </div>

      <UserManagementClient
        initialUsers={users}
        currentUserId={session?.user?.id || ""}
      />
    </div>
  );
}
