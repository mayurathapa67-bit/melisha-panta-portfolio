import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authed = await getSession();
  if (!authed) {
    redirect("/admin/login");
  }
  return <AdminDashboard />;
}
