import type { Metadata } from 'next';
import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import './globals.css';
import styles from './layout.module.css';

export const metadata: Metadata = {
    title: 'akhsync ドキュメント',
    description: 'Minecraft Bedrock Edition アドオン開発のための強力なCLIライブラリ',
    icons: '/favicon.svg',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='ja'>
            <body>
                <Header />
                <Sidebar />
                <main className={styles.mainContent}>{children}</main>
            </body>
        </html>
    );
}
