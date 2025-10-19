import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <Link href='/' className={styles.logo}>
                    ⚡ akhsync
                </Link>
                <div className={styles.headerLinks}>
                    <Link href='/' className={styles.headerLink}>
                        ホーム
                    </Link>
                    <a href='https://github.com/AKHstudio/akh_file_sync' className={styles.headerLink} target='_blank' rel='noopener noreferrer'>
                        GitHub
                    </a>
                    <a href='https://www.npmjs.com/package/@akhstudio/akhsync' className={styles.headerLink} target='_blank' rel='noopener noreferrer'>
                        npm
                    </a>
                </div>
            </div>
        </header>
    );
}
