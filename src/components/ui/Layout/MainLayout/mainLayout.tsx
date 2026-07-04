import FooterLayout from '../Footer/footerLayout';
import HeaderLayout from '../Header/headerLayout';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderLayout />     
      <main className="flex-grow w-full">
        {children}
      </main>
      <FooterLayout />  
    </div>
  );
}