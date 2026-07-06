import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import axios from 'axios'
import LoginForm from '@/components/ui/Form/Login/loginForm'
import RegisterForm from '@/components/ui/Form/Login/registerForm'
import { API } from '@/lib/apiendpoint'
import type { Province, RegisterOptions } from '@/types/auth.types'

export const Route = createFileRoute('/login')({
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
          console.error("Lỗi khi lấy danh sách tỉnh:", error)
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
          console.error("Lỗi khi lấy danh sách options:", error)
        }
      }

      fetchOptions()
    }, [])  

  return (
    <>
      <div className='main-login grid grid-cols-1 lg:grid-cols-12 gap-4'>
        <div className='left-content hidden lg:block lg:col-span-4'>
          <div className="sidebar">
            <div className="logo">
              <div className="logo-badge">⭐</div>
              <div className="logo-name">Spotlight</div>
            </div>

            <h1 className="headline">Every talent has<br/>a place to be <em>seen.</em></h1>
            <p className="subcopy">Join 50,000+ creators sharing their work, finding their community, and getting discovered.</p>

            <div className="stats">
              <div className="stat-card">
                <div className="stat-icon blue">👥</div>
                <div>
                  <p className="stat-title">50,000+ creators</p>
                  <p className="stat-desc">already telling their story</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple">🎓</div>
                <div>
                  <p className="stat-title">800+ mentors &amp; scouts</p>
                  <p className="stat-desc">actively discovering talent</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green">🏆</div>
                <div>
                  <p className="stat-title">Weekly contests</p>
                  <p className="stat-desc">with real prizes &amp; recognition</p>
                </div>
              </div>
            </div>

            <div className="testimonial">
              <p>"I posted one dance video on a Tuesday. By Friday a scout had messaged me about an audition."</p>
              <div className="testimonial-author">
                <div className="avatar">DK</div>
                <span>Dev Kapoor · Dancer</span>
              </div>
            </div>
          </div>
        </div>

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
      </div>
      
    </>
  )
}
