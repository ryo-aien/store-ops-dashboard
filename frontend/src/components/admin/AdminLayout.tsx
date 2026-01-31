'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { id: 'dashboard', label: 'ダッシュボード', icon: 'map', href: '/dashboard' },
  { id: 'analysis', label: 'KPI分析', icon: 'chart', href: '/analysis' },
] as const;

type NavId = (typeof navItems)[number]['id'];

interface AdminLayoutProps {
  children: React.ReactNode;
  activeNav?: NavId;
}

export function AdminLayout({ children, activeNav }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const currentNav = activeNav || navItems.find((item) => item.href === pathname)?.id || 'dashboard';

  const NavIcon = ({ icon }: { icon: string }) => {
    switch (icon) {
      case 'map':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        );
      case 'chart':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Left Navigation Sidebar */}
      <aside
        className={`flex-shrink-0 bg-gray-900 text-white flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'w-56' : 'w-16'
        }`}
      >
        <div className={`p-4 border-b border-gray-700 flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {sidebarOpen && (
            <div>
              <h1 className="text-lg font-bold">支店管理</h1>
              <p className="text-xs text-gray-400 mt-0.5">Branch Management</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
            title={sidebarOpen ? '閉じる' : '開く'}
          >
            <svg
              className={`w-5 h-5 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    currentNav === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  } ${sidebarOpen ? '' : 'justify-center'}`}
                  title={sidebarOpen ? undefined : item.label}
                >
                  <NavIcon icon={item.icon} />
                  {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {sidebarOpen && (
          <div className="p-3 border-t border-gray-700">
            <div className="text-xs text-gray-500 text-center">
              v1.0.0
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
