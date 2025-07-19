'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from "next-auth/react";
import { usePathname } from 'next/navigation';
import { useLocale } from "next-intl";
import { 
  Home, 
  Users, 
  BarChart3, 
  Settings, 
  FileText, 
  ShoppingCart, 
  Calendar,
  Bell,
  Search,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
  { id: 'users', label: 'Users', icon: Users, href: '/users' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, href: '/orders', badge: '12' },
  { id: 'reports', label: 'Reports', icon: FileText, href: '/reports' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, href: '/calendar' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
];

export default function DashboardMenu() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const locale = useLocale(); // Get the current locale
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between px-4 h-full">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <User className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={toggleMobileMenu} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full bg-accent border-r border-gray-200 z-50 transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-24' : 'w-64'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className={`flex items-center justify-between border-b border-gray-200 ${isCollapsed ? 'p-2' : 'p-4'}`}>
          {isCollapsed ? (
            <div className="flex items-center justify-center w-full">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Dashboard</h2>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={window.innerWidth < 1024 ? toggleMobileMenu : toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {window.innerWidth < 1024 ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              )}
            </button>
          )}
        </div>

        {/* Collapse/Expand Button for Desktop */}
        {isCollapsed && (
          <div className="hidden lg:flex justify-center p-2">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        )}

        {/* Search */}
        {!isCollapsed && (
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 pb-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <div key={item.id}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center px-3 py-2 rounded-lg transition-all duration-200 group relative
                      ${isActive 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                      ${isCollapsed ? 'justify-start pl-2 w-14 h-12' : 'space-x-3'}
                    `}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                    {!isCollapsed && (
                      <>
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {isCollapsed && item.badge && (
                      <span className="absolute top-0 right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                        {item.label}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-900"></div>
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-2 border-t border-gray-200">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3 px-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">JD</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <LogOut className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">JD</span>
              </div>
              <div onClick={() => signOut({ callbackUrl: `/${locale}/login-signin` })}>   
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors"  >
                <LogOut className="h-4 w-4 text-gray-600" />
              </button>

              </div>
           
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
        pt-16 lg:pt-0
      `}>
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Dashboard</h1>
            <p className="text-gray-600">
              This is your main content area. The sidebar is fully responsive and includes:
            </p>
            <ul className="mt-4 space-y-2 text-gray-600">
              
              <li> User profile section</li>
              <li> Notification badges</li>
              <li> Smooth animations and transitions</li>
              <li> Clean light theme design</li>
            </ul>
            <p onClick={() => signOut({ callbackUrl: `/${locale}/login-signin` })}>logout</p>
          </div>
        </div>
      </main>
    </>
  );
}