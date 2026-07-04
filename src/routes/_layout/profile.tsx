import { createFileRoute } from '@tanstack/react-router'
import Profile from '@/components/ui/Profile/profile'

export const Route = createFileRoute('/_layout/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return(
    <>
        <Profile />
    </>
  )
}
