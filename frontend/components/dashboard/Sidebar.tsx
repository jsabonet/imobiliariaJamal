'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiHome, FiFileText, FiMail, FiGrid, FiSettings, FiLogOut, FiArrowLeft, FiUsers } from 'react-icons/fi';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { href: '/dashboard', icon: FiGrid, label: 'Dashboard' },
    { href: '/dashboard/propriedades', icon: FiHome, label: 'Propriedades' },
    { href: '/dashboard/agentes', icon: FiUsers, label: 'Agentes' },
    { href: '/dashboard/avaliacoes', icon: FiFileText, label: 'Avaliações' },
    { href: '/dashboard/contactos', icon: FiMail, label: 'Contactos' },
  ];

  async function handleLogout() {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <div className="w-64 lg:w-72 bg-gradient-to-b from-secondary to-secondary-900 h-screen text-white flex flex-col shadow-2xl">
      {/* Logo */}
      <div className="flex-shrink-0 p-6 lg:p-8 border-b border-white/10">
        <div className="flex items-center gap-3">
          {/* <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">IJ</span>
          </div> */}
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-primary">IJPS Admin</h1>
            <p className="text-xs text-gray-300 mt-0.5">Painel Administrativo</p>
          </div>
        </div>
      </div>

      {/* Navigation - Rolável */}
      <nav className="flex-1 p-4 lg:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-white/10">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200
                    touch-manipulation active:scale-95 min-h-[48px] lg:min-h-[44px]
                    ${isActive 
                      ? 'bg-primary text-white shadow-lg scale-105' 
                      : 'hover:bg-white/10 text-gray-200 hover:text-white hover:pl-6'
                    }
                  `}
                >
                  <Icon size={22} className="flex-shrink-0" />
                  <span className="font-medium text-sm lg:text-base">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer - Fixo na parte inferior */}
      <div className="flex-shrink-0 p-4 lg:p-6 border-t border-white/10 space-y-2 bg-secondary-900">
        <Link
          href="/"
          onClick={handleLinkClick}
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-white/10 text-gray-200 hover:text-white transition-all duration-200 touch-manipulation active:scale-95 min-h-[48px]"
        >
          <FiArrowLeft size={20} className="flex-shrink-0" />
          <span className="font-medium text-sm lg:text-base">Voltar ao Site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-red-600 text-gray-200 hover:text-white transition-all duration-200 touch-manipulation active:scale-95 min-h-[48px]"
        >
          <FiLogOut size={20} className="flex-shrink-0" />
          <span className="font-medium text-sm lg:text-base">Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
