import { createFileRoute } from '@tanstack/react-router'
import Explore from '@/components/ui/Explore/explores'
import { PageTitle } from '@/components/PageTitle/pagetitle'

export const Route = createFileRoute('/_layout/explores')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
        <PageTitle title={"Explores"} />
        <Explore />
    </>
  )
}
