import { createFileRoute, redirect } from '@tanstack/react-router'
import Profile from '@/components/ui/Profile/profile'
import Achievements from '@/components/ui/Achievements/achievements'
import { PageTitle } from '@/components/PageTitle/pagetitle'

export const Route = createFileRoute('/_layout/profile')({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return(
    <>
        <PageTitle title={"Profile"} />
        <Profile />
        <Achievements />
    </>
  )
}
