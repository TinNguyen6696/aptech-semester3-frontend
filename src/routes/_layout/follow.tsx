import { PageTitle } from '@/components/PageTitle/pagetitle'
import FollowerPage from '@/components/ui/Followers/followerPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/follow')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
        <PageTitle title={"Follow"} />
        <FollowerPage />
    </>
  )
}
