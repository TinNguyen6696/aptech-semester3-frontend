import AdminReports from '@/components/ui/Admin/Reports/admin.report'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout_admin/admin/reports')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <AdminReports />
    </>
  )
}
