import type { SubLayoutProps } from '@/types/layout.types';


export default function SubLayout({ children }: SubLayoutProps) {
  return (
    <div className='main-login grid grid-cols-1 lg:grid-cols-12 gap-4'>
                    <div className='left-content hidden lg:block lg:col-span-4'>
                      <div className="sidebar">
                        <a className="logo" href='/'>
                          <div className="logo-badge">⭐</div>
                          <div className="logo-name">Spotlight</div>
                        </a>
            
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
                    
                    {children}                     
                  </div>
  );
}