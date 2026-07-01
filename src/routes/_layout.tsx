import { createFileRoute, Outlet } from '@tanstack/react-router'
import MainLayout from '@/components/ui/Layout/MainLayout/mainLayout'

export const Route = createFileRoute('/_layout')({
  component: () => (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ),
})
