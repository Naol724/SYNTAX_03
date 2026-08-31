import { AuthProvider } from "@/lib/auth-context";
import AdminLayout from "@/components/admin/AdminLayout";

export const dynamic = "force-dynamic";

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayout>{children}</AdminLayout>
    </AuthProvider>
  );
}
