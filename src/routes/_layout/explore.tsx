import { createFileRoute } from '@tanstack/react-router'
import Explore from '@/components/ui/Explore/explore'
import { PageTitle } from '@/components/PageTitle/pagetitle'

export const Route = createFileRoute('/_layout/explore')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
        <PageTitle title={"Explore"} />
        <Explore />
    </>
  )
}
