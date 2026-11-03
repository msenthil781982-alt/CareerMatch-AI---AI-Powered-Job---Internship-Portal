import Sidebar from './Sidebar';

export default function DashboardLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen bg-[#0F0F1A]">
      <Sidebar />
      <main className="main-content flex-1 p-6 md:p-8">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && <h1 className="text-2xl font-bold text-white">{title}</h1>}
            {subtitle && <p className="text-slate-400 mt-1 text-sm">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
