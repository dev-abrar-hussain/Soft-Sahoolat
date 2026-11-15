import { requireAdmin } from '@/lib/auth'; import { AdminShell } from '@/components/admin/AdminShell';
export default async function ProtectedLayout({children}:{children:React.ReactNode}){const admin=await requireAdmin(true);return <AdminShell username={admin.username}>{children}</AdminShell>}
