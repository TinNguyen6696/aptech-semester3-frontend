import MyVideosPage from '@/components/ui/MyVideo/myvideos'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/myvideos')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <MyVideosPage />
    </>
  )
}
