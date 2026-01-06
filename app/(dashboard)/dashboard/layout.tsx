import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-primary-50">
      <Header />
      <Sidebar />
      <main className="ml-64 pt-16 p-8">{children}</main>
    </div>
  );
}

