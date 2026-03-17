'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // A clean array to map through so we don't repeat our styling logic
  const navLinks = [
    { name: 'Routes', href: '/routes' },
    { name: 'Categories', href: '/categories' },
    { name: 'Vehicles', href: '/vehicles' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-purple-600 text-white p-1.5 rounded-lg group-hover:bg-purple-700 transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight group-hover:text-purple-700 transition-colors">
            Transport<span className="text-purple-600">Route</span>
          </span>
        </Link>

        {/* Dynamic Navigation Links */}
        <div className="flex gap-4 font-medium text-sm">
          {navLinks.map((link) => {
            // Check if the current URL starts with the link's href
            const isActive = pathname.startsWith(link.href);
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-md transition-all ${
                  isActive 
                    ? 'bg-purple-50 text-purple-700 font-bold' // Active state
                    : 'text-gray-500 hover:text-purple-600 hover:bg-gray-50' // Inactive state
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
        
      </div>
    </nav>
  );
}