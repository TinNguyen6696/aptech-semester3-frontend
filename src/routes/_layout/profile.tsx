import { createFileRoute, redirect } from '@tanstack/react-router'
import Profile from '@/components/ui/Profile/profile'
import Achievements from '@/components/ui/Achievements/achievements'
import { PageTitle } from '@/components/PageTitle/pagetitle'
import ChangePassword from '@/components/ui/ChangePassword/changePassword'
import { useUserStore } from '@/Store/userStore'

export const Route = createFileRoute('/_layout/profile')({
  beforeLoad: () => {
    if (!useUserStore.getState().userInfo) {
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
        <ChangePassword />
        <Achievements />
    </>
  )
}
