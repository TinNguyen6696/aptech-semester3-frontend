import HeaderLayout from '../Header/headerLayout';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderLayout />     
      <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>

    </div>
  );
}