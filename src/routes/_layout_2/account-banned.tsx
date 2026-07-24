import BannedAccountCard from '@/components/ui/Form/Login/bannedAccountCard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout_2/account-banned')({
  validateSearch: (search: Record<string, unknown>) => ({
    email: (search.email as string) || '',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { email } = Route.useSearch();
  return (
    <>
      <div className='right-content flex flex-col justify-center items-center col-span-1 lg:col-span-8 px-4'>
        <BannedAccountCard email={email}/>
      </div>
    </>
  )
}