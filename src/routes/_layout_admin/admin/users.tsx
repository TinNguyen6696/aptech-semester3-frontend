// _layout_admin/users.tsx
import AdminUsers from '@/components/ui/Admin/User/admin.user'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout_admin/admin/users')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AdminUsers />
}