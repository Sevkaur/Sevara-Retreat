import { AdminEditor } from "@/app/admin/AdminEditor";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const initialContent = await getSiteContent();
  return <AdminEditor initialContent={initialContent} />;
}
