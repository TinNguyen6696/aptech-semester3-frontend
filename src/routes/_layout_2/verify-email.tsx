import VerifyErrorCard from '@/components/ui/Form/VerifyMaill/verifyMailErrorCard';
import VerifySuccessCard from '@/components/ui/Form/VerifyMaill/verifyMailSuccessCard'
import { API } from '@/lib/apiendpoint';
import axiosClient from '@/services/axiosClient';
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react';

type VerifyStatus = 'loading' | 'success' | 'error';

export const Route = createFileRoute('/_layout_2/verify-email')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || '',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { token } = Route.useSearch();
  const [status, setStatus] = useState<VerifyStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('The verification link is invalid.');
      return;
    }

    const verifyAccount = async () => {
      try {
        const res = await axiosClient.post(API.AXIOS_VERIFY_EMAIL, { Token: token });
        if (res.data.isSuccess) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage(res.data.message || 'Verification failed.');
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage('An error occurred, please try again.');
      }
    };

    verifyAccount();
  }, [token]);
  
  const renderCard = () => {
    switch (status) {
      case 'loading':
        return <div className="loading-spinner">Verifying your email...</div>;
      case 'success':
        return <VerifySuccessCard />;
      case 'error':
        return <VerifyErrorCard message={errorMessage} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className='right-content flex flex-col justify-center items-center col-span-1 lg:col-span-8 px-4'>
          <div className='right-content-cover'>               
            <div className='form-container w-full'>
              {renderCard()}
          </div>
        </div>
                        
      </div>
    </>
  )
}
