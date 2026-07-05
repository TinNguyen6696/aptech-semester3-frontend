import Mentors from '@/components/ui/Mentors/mentors'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/mentors')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Mentors />
    </>
  )
}
