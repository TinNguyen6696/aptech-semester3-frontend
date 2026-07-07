import { createFileRoute, Outlet } from '@tanstack/react-router'
import SubLayout from '@/components/ui/Layout/SubLayout/subLayout'

export const Route = createFileRoute('/_layout_2')({
  component: () => (
      <SubLayout>
        <Outlet />
      </SubLayout>
    ),
})
