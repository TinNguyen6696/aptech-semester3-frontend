import MentorProfile from '@/components/ui/Mentors/mentorProfile';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/mentorProfile')({
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as string) || '',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useSearch();

  return (
    <>
      <MentorProfile id={id} />
    </>
  )
}