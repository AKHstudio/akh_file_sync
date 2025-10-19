import Link from 'next/link';
import styles from './QuickLinkCard.module.css';

interface QuickLinkCardProps {
    href: string;
    title: string;
    description: string;
    external?: boolean;
}

export default function QuickLinkCard({ href, title, description, external = false }: QuickLinkCardProps) {
    const content = (
        <>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
        </>
    );

    if (external) {
        return (
            <a href={href} className={styles.card} target='_blank' rel='noopener noreferrer'>
                {content}
            </a>
        );
    }

    return (
        <Link href={href} className={styles.card}>
            {content}
        </Link>
    );
}
