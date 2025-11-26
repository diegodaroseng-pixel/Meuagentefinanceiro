'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Upload, Database, TrendingUp, LogOut } from 'lucide-react';
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';

export default function Navigation() {
    const pathname = usePathname();

    const links = [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/upload', label: 'Upload', icon: Upload },
        { href: '/database', label: 'Banco de Dados', icon: Database },
        { href: '/forecasts', label: 'Previsões', icon: TrendingUp },
    ];

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold text-blue-600">💰 Financial Agent</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 mr-2" />
                                    {link.label}
                                </Link>
                            );
                        })}

                        {/* Auth Buttons */}
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                    Login
                                </button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </nav>
    );
}
