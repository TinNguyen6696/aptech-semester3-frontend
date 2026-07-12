import CommunityDetail from '@/components/ui/Communities/communityDetail';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/communityDetail')({
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as string) || '',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useSearch();

  return (
    <>
      <CommunityDetail id={id} />
    </>
  )
}