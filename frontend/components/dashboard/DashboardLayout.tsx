'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    console.log('DashboardLayout mounted, sidebarOpen:', sidebarOpen);
  }, [sidebarOpen]);

  const toggleSidebar = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Button clicked! Current state:', sidebarOpen);
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile Menu Toggle - Botão Lateral Profissional */}
      <button
        suppressHydrationWarning
        type="button"
        onClick={toggleSidebar}
        onTouchEnd={toggleSidebar}
        className={`
          lg:hidden fixed top-1/2 -translate-y-1/2 z-[60]
          bg-gradient-to-r from-primary to-primary-dark text-white 
          shadow-2xl hover:shadow-3xl transition-all duration-300
          flex items-center justify-center
          ${sidebarOpen ? 'left-64' : 'left-0'}
          rounded-r-xl
          w-10 h-20
          active:scale-95
        `}
        aria-label="Toggle menu"
        style={{ 
          pointerEvents: 'auto',
          boxShadow: '2px 0 12px rgba(0,0,0,0.15)'
        }}
      >
        {sidebarOpen ? (
          <FiChevronLeft size={24} />
        ) : (
          <FiChevronRight size={24} />
        )}
      </button>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-[35] animate-fadeIn"
          onClick={() => {
            console.log('Overlay clicked, closing sidebar');
            setSidebarOpen(false);
          }}
        />
      )}

      {/* Sidebar - Fixa */}
      <aside 
        className={`
          fixed lg:relative inset-y-0 left-0 z-[40] h-screen
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <Sidebar onClose={() => {
          console.log('Sidebar onClose called');
          setSidebarOpen(false);
        }} />
      </aside>

      {/* Main Content - Rolável */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden w-full pt-20 lg:pt-0">
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
