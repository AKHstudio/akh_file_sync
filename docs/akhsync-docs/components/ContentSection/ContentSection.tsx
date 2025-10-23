import { ReactNode } from 'react';
import styles from './ContentSection.module.css';

interface ContentSectionProps {
    children: ReactNode;
    id?: string;
}

export default function ContentSection({ children, id }: ContentSectionProps) {
    return (
        <section className={styles.contentSection} id={id}>
            {children}
        </section>
    );
}
