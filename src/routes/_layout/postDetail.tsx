import PostDetail from '@/components/ui/Communities/postDetail';
import { createFileRoute, useRouterState } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/postDetail')({
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as string) || '',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useSearch();
  const { post } = useRouterState({
      select: (s) => s.location.state as { post?: any },
  });

  return (
    <>
      <PostDetail id={id} initialData={post} />
    </>
  )
}