import { PageTitle } from '@/components/PageTitle/pagetitle'
import Contests from '@/components/ui/Contests/contests.'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/contests')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <PageTitle title={"Contests"} />
      <Contests />
    </>
  )
}
