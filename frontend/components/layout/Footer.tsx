import React from 'react';
import Link from 'next/link';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">IJPS</h3>
            <p className="text-gray-300 mb-4">
              Imobiliária Jamal & Prestação de Serviços - Encontre o imóvel dos seus sonhos em Moçambique.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition"
                aria-label="Facebook"
              >
                <FiFacebook size={24} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition"
                aria-label="Instagram"
              >
                <FiInstagram size={24} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition"
                aria-label="LinkedIn"
              >
                <FiLinkedin size={24} />
              </a>
              <a 
                href="https://wa.me/258841339593" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-accent-400 transition"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/propriedades" className="text-gray-300 hover:text-primary transition">
                  Propriedades
                </Link>
              </li>
              <li>
                <Link href="/servicos" className="text-gray-300 hover:text-primary transition">
                  Serviços
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-gray-300 hover:text-primary transition">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-300 hover:text-primary transition">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Nossos Serviços</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/servicos/avaliacao" className="text-gray-300 hover:text-primary transition">
                  Avaliação de Imóveis
                </Link>
              </li>
              <li>
                <Link href="/servicos/venda" className="text-gray-300 hover:text-primary transition">
                  Venda de Propriedades
                </Link>
              </li>
              <li>
                <Link href="/servicos/arrendamento" className="text-gray-300 hover:text-primary transition">
                  Arrendamento
                </Link>
              </li>
              <li>
                <Link href="/servicos/consultoria" className="text-gray-300 hover:text-primary transition">
                  Consultoria
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FiMapPin size={20} className="text-primary mt-1 flex-shrink-0" />
                <span className="text-gray-300">
                  Av. Julius Nyerere, Maputo<br />
                  Moçambique
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone size={20} className="text-primary flex-shrink-0" />
                <div className="text-gray-300">
                  <a href="tel:+258820061863" className="hover:text-primary transition block">
                    +258 82 006 1863
                  </a>
                  <a href="tel:+258841339593" className="hover:text-primary transition block">
                    +258 84 133 9593
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <FiMail size={20} className="text-primary flex-shrink-0" />
                <a href="mailto:anilton.jm13@gmail.com" className="text-gray-300 hover:text-primary transition">
                  anilton.jm13@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>
              © {currentYear} IJPS - Imobiliária Jamal & Prestação de Serviços. Todos os direitos reservados.
            </p>
            <div className="flex gap-6">
              <Link href="/privacidade" className="hover:text-primary transition">
                Privacidade
              </Link>
              <Link href="/termos" className="hover:text-primary transition">
                Termos de Uso
              </Link>
            </div>
          </div>
          <p className="text-center md:text-left mt-4 text-xs text-gray-500">
            Desenvolvido por <span className="text-primary font-medium">Zawadi Digital</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
