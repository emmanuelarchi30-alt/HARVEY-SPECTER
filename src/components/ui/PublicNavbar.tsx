'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scale } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { PillNav, type PillNavItem } from '@/components/ui/PillNav';
import { HeaderControls } from '@/components/ui/HeaderControls';
import SpecularButton from '@/components/ui/SpecularButton';

export interface PublicNavbarProps {
  className?: string;
}

export function PublicNavbar({ className = '' }: PublicNavbarProps) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isLight = theme === 'light';

  const navItems: PillNavItem[] = [
    { label: t.nav_home || 'Inicio', href: '/' },
    { label: t.nav_consult || 'Consultar Caso', href: '/consultar-caso' },
    { label: t.nav_pricing || 'Aranceles & Tiempos', href: '/aranceles' },
    { label: t.nav_constitution || 'Constitución 1991', href: '/constitucion' },
    { label: t.nav_lawyer_access || 'Acceso Abogados', href: '/login' }
  ];

  return (
    <header className={`border-b border-white/[0.08] fluid-glass sticky top-0 z-50 transition-colors duration-300 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-2.5 flex items-center justify-between gap-3">
        {/* PillNav de React Bits con Logo y Rutas Públicas */}
        <div className="flex items-center gap-3 min-w-0">
          <PillNav
            logo={<Scale className="w-5 h-5 text-amber-500" />}
            logoAlt="Specter & Asociados"
            logoHref="/"
            items={navItems}
            activeHref={pathname}
            linkComponent={Link}
            theme={isLight ? 'light' : 'dark'}
            layout="split"
            surface="glass"
            itemStyle="pill"
            hoverEffect="fill"
            indicator="dot"
            highlightColor="#f59e0b"
            highlightTextColor="#0f172a"
          />

          {/* Subtítulo de Firma para pantallas grandes */}
          <div className="hidden xl:flex flex-col pl-2 border-l border-white/10">
            <span className={`font-serif font-bold text-sm tracking-tight leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Specter & Asociados
            </span>
            <span className="text-[10px] text-amber-500 font-semibold tracking-wider uppercase">
              Litigio de Élite • Colombia
            </span>
          </div>
        </div>

        {/* Controles: Selector de Idioma, Tema Claro/Oscuro y CTA */}
        <div className="flex items-center space-x-2 shrink-0">
          <HeaderControls />

          <div className="hidden sm:block">
            <SpecularButton
              href="/register"
              size="sm"
              radius={14}
              tint={isLight ? '#f59e0b' : '#ffffff'}
              tintOpacity={isLight ? 0.15 : 0.08}
              textColor={isLight ? '#92400e' : '#ffffff'}
              lineColor={isLight ? '#d97706' : '#f59e0b'}
              baseColor={isLight ? '#fef3c7' : '#525252'}
              intensity={1.1}
              idleIntensity={0.35}
              followMouse
            >
              {t.nav_register_firm}
            </SpecularButton>
          </div>
        </div>
      </div>
    </header>
  );
}

export default PublicNavbar;
