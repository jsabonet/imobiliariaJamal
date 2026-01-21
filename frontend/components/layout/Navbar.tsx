'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX, FiPhone, FiMail, FiHeart } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import Button from '@/components/ui/Button';
import { useFavorites } from '@/lib/useFavorites';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { count } = useFavorites();

  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/propriedades', label: 'Propriedades' },
    { href: '/servicos', label: 'Serviços' },
    { href: '/sobre', label: 'Sobre Nós' },
    { href: '/contacto', label: 'Contacto' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar - Hidden on mobile */}
      <div className="hidden md:block bg-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2 text-sm">
            <div className="flex gap-6">
              <a href="tel:+258840000000" className="flex items-center gap-2 hover:text-primary-200 transition">
                <FiPhone size={14} />
                +258 84 000 0000
              </a>
              <a href="mailto:anilton.jm13@gmail.com" className="flex items-center gap-2 hover:text-primary-200 transition">
                <FiMail size={16} />
                anilton.jm13@gmail.com
              </a>
            </div>
            <div className="flex gap-4">
              <a 
                href="https://wa.me/258840000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-accent-300 transition"
              >
                <FaWhatsapp size={16} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="text-3xl font-bold text-primary tracking-tight">
              IJPS
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-secondary hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/favoritos"
              className="relative text-secondary hover:text-primary transition-colors font-medium flex items-center gap-2"
            >
              <FiHeart size={20} />
              Favoritos
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>
            <Link
              href="/dashboard"
              className="text-secondary hover:text-primary transition-colors font-semibold border border-primary rounded px-3 py-1 ml-2"
            >
              Área Administrativa
            </Link>
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:block">
            <Link href="/avaliar">
              <Button>Avaliar Imóvel</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-secondary p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-secondary hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/favoritos"
                className="text-secondary hover:text-primary transition-colors font-medium py-2 flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <FiHeart size={20} />
                Favoritos
                {count > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {count}
                  </span>
                )}
              </Link>
              <div className="pt-4 border-t flex flex-col gap-2">
                <Link href="/avaliar" onClick={() => setIsOpen(false)}>
                  <Button fullWidth>Avaliar Imóvel</Button>
                </Link>
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button fullWidth variant="outline">Área Administrativa</Button>
                </Link>
              </div>
              <div className="flex flex-col gap-3 pt-4 border-t">
                <a href="tel:+258840000000" className="flex items-center gap-3 text-secondary">
                  <FiPhone size={20} />
                  +258 84 000 0000
                </a>
                <a 
                  href="https://wa.me/258840000000" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-accent-600"
                >
                  <FaWhatsapp size={20} />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
