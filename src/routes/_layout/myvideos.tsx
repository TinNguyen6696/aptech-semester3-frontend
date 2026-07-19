import { PageTitle } from '@/components/PageTitle/pagetitle'
import MyVideosPage from '@/components/ui/MyVideo/myvideos'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/myvideos')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <PageTitle title={"My videos"} />
      <MyVideosPage />
    </>
  )
}
