import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import axios from 'axios'
import LoginForm from '@/components/ui/Form/Login/loginForm'
import RegisterForm from '@/components/ui/Form/Login/registerForm'
import { API } from '@/lib/apiendpoint'
import type { Province, RegisterOptions } from '@/types/auth.types'

export const Route = createFileRoute('/_layout_2/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isLogin, setIsLogin] = useState(true)
  const [provinces, setProvinces] = useState<Province[]>([])
  const [options, setOptions] = useState<RegisterOptions>({})
  useEffect(() => {
      const fetchProvinces = async () => {
        try {
          const response = await axios.get(API.PROVINCE_GET_ALL)
          setProvinces(response.data.data)
        } catch (error) {
          console.error("Error fetching provinces:", error)
        }
      }

      fetchProvinces()
    }, [])

  useEffect(() => {
      const fetchOptions = async () => {
        try {
          const response = await axios.get(API.OPTION_GET_ALL)
          setOptions(response.data.data)
        } catch (error) {
          console.error("Error fetching options:", error)
        }
      }

      fetchOptions()
    }, [])  

  return (
    <>
      <div className='right-content flex flex-col justify-center items-center col-span-1 lg:col-span-8 px-4'>                                 
          <div className='right-content-cover'>
            <div className="tab-pane-custom flex gap-4">
              <button 
                onClick={() => setIsLogin(true)} 
                className={`py-2 transition-all duration-300 w-1/2 ${isLogin ? 'text-white bg-[#2b7fff]' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setIsLogin(false)} 
                className={`py-2 transition-all duration-300 w-1/2 ${!isLogin ? 'text-white bg-[#2b7fff]' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Create account
              </button>
            </div>

            <div className='form-container w-full'>
              {isLogin ? (
                <div className='login-section'>
                  <LoginForm />
                </div>
              ) : (
                <div className='register-section'>
                  <RegisterForm 
                    provinces={provinces}
                    options={options}
                    />
                </div>
              )}
            </div>
          </div>                      
      </div>         
    </>
  )
}
