import { ReactNode } from 'react';
import styles from './Alert.module.css';

interface AlertProps {
    type: 'note' | 'important' | 'tip' | 'warning';
    title: string;
    children: ReactNode;
}

export default function Alert({ type, title, children }: AlertProps) {
    return (
        <div className={`${styles.alert} ${styles[type]}`}>
            <div className={styles.alertTitle}>{title}</div>
            <div className={styles.alertContent}>{children}</div>
        </div>
    );
}
