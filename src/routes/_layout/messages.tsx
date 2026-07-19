import { PageTitle } from '@/components/PageTitle/pagetitle'
import Messages from '@/components/ui/Messages/messages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/messages')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
        <PageTitle title={"Messages"} />
        <Messages />
    </>
  )
}
