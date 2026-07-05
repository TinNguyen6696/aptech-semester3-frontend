import Stories from '@/components/ui/Stories/stories'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/stories')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Stories />
    </>
  )
}
