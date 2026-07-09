import InputSendEmailForm from '@/components/ui/Form/VerifyMaill/inputSendEmailForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout_2/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <>
        <div className='right-content flex flex-col justify-center items-center col-span-1 lg:col-span-8 px-4'>
          <div className='right-content-cover'> 
            <InputSendEmailForm />
          </div>                                        
        </div>
      </>
    )
}
