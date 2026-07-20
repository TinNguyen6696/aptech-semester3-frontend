import AdminDashboard from '@/components/ui/Admin/Dashboard/admin.dashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout_admin/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <AdminDashboard />
    </>
  )
}
