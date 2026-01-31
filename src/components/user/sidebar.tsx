'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function UserSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/user/dashboard', icon: '📊' },
    { name: 'Profile', href: '/user/profile', icon: '👤' },
    { name: 'Conferences', href: '/user/conferences', icon: '📅' },
    { name: 'Donations', href: '/user/donations', icon: '💰' },
    { name: 'Membership', href: '/user/membership', icon: '🎫' },
    { name: 'Volunteers', href: '/user/volunteers', icon: '👥' },
    { name: 'Collaborations', href: '/user/collaborations', icon: '🤝' },
    { name: 'Interviews', href: '/user/interviews', icon: '🎤' },
  ];

  const handleLogout = () => {
    // Sign out using next-auth
    // This would typically call signOut() from next-auth
    window.location.href = '/auth/logout'; // Fallback to simple redirect
  };

  return (
    <aside className="w-64 bg-white shadow-md h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold">User Panel</h2>
        <p className="text-sm text-gray-500">Personal Dashboard</p>
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