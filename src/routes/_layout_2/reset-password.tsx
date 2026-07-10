import ResetPasswordForm from '@/components/ui/Form/Login/resetPasswordForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout_2/reset-password')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || '',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { token } = Route.useSearch();

  return (
    <>
      <div className='right-content flex flex-col justify-center items-center col-span-1 lg:col-span-8 px-4'>
        <div className='right-content-cover'> 
          <ResetPasswordForm token={token}/>  
        </div>          
      </div>         
    </>
  )
}
