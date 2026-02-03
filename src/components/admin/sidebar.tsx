'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { name: 'Memberships', href: '/admin/memberships', icon: '🎫' },
    { name: 'Volunteers', href: '/admin/volunteers', icon: '👥' },
    { name: 'Collaborations', href: '/admin/collaborations', icon: '🤝' },
    { name: 'Donations', href: '/admin/donations', icon: '💰' },
    { name: 'Conferences', href: '/admin/conferences', icon: '📅' },
    { name: 'Interviews', href: '/admin/interviews', icon: '🎤' },
    { name: 'Users', href: '/admin/users', icon: '👤' },
    {name : 'CMS Managment', href: '/admin/cms/dashboard', icon: '📝' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/auth/login';
  };

  return (
    <aside className="w-64 bg-white shadow-md h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <p className="text-sm text-gray-500">Management Console</p>
      </div>

      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start mb-1',
                    pathname === item.href ? 'bg-accent' : ''
                  )}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}