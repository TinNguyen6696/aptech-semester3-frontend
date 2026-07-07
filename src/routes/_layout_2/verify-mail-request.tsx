import VerifyEmailCard from '@/components/ui/Form/VerifyMaill/verifyMailCard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout_2/verify-mail-request')({
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
          <div className='right-content-cover'>               
            <div className='form-container w-full'>
              <VerifyEmailCard email={email}/>
            </div>
          </div>   
       </div>         
     </>
  )
}
