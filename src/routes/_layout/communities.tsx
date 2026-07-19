import { PageTitle } from '@/components/PageTitle/pagetitle'
import Communities from '@/components/ui/Communities/communities'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/communities')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <PageTitle title={"Communities"} />
      <Communities />
    </>
  )
}
