import CommunityBoard from '@/components/ui/Communities/communityBoard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/communityBoard')({
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as string) || '',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useSearch();
  return (
    <>
      <CommunityBoard id={id}/>
    </>
  )
}
