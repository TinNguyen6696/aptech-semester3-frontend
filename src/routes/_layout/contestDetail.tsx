import ContestDetail from '@/components/ui/Contests/contestDetail';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/contestDetail')({
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as string) || '',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useSearch();

  return (
    <>
      <ContestDetail id={id} />
    </>
  )
}
