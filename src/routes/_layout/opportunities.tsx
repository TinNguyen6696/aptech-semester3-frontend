import Opportunities from '@/components/ui/Opportunities/opportunities'
import { useUserStore } from '@/Store/userStore'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/opportunities')({
  component: RouteComponent,
})

function RouteComponent() {
    const {userInfo} = useUserStore();
    const role = userInfo?.role;
  return (
    <>
        <Opportunities role={role}/>
    </>
  )
}
