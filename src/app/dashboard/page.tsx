import { redirect } from "next/navigation";
import { DashboardApp } from "@/components/DashboardApp";
import { getCurrentSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");
  return <DashboardApp user={{ id: session.sub, name: session.name, email: session.email, role: session.role }} />;
}
