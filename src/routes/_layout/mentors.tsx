import { PageTitle } from '@/components/PageTitle/pagetitle'
import Mentors from '@/components/ui/Mentors/mentors'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/mentors')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <PageTitle title={"Mentors"} />
      <Mentors />
    </>
  )
}
