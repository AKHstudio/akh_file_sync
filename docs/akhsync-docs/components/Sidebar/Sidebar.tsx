'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './Sidebar.module.css';

const navItems = [
  { href: '/', label: 'ホーム' },
  { href: '/installation', label: 'インストール方法' },
  { href: '/quickstart', label: 'クイックスタートガイド' },
  { href: '/#commands', label: 'コマンド一覧' },
  { href: '/commands/build', label: 'build コマンド', sub: true },
  { href: '/commands/sync', label: 'sync コマンド', sub: true },
  { href: '/commands/async', label: 'async コマンド', sub: true },
  { href: '/commands/watch', label: 'watch コマンド', sub: true },
  { href: '/commands/dist', label: 'dist コマンド', sub: true },
  { href: '/#development', label: '開発用ドキュメント' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${
              pathname === item.href ? styles.active : ''
            } ${item.sub ? styles.subLink : ''}`}
            onClick={() => setIsOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div
        className={`${styles.sidebarOverlay} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(false)}
      />

      <button
        className={styles.menuToggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="メニュー"
      >
        {isOpen ? '✕' : '☰'}
      </button>
    </>
  );
}
