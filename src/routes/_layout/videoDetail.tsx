// src/routes/_layout/videoDetail.tsx
import VideoDetail from '@/components/ui/Explore/videoDetail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/videoDetail')({
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as string) || '',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useSearch();

  return (
    <>
      <VideoDetail id={id} />
    </>
  )
}