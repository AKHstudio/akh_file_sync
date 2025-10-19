import { ReactNode } from 'react';
import styles from './InfoBox.module.css';

interface InfoBoxProps {
    children: ReactNode;
    style?: React.CSSProperties;
}

export default function InfoBox({ children, style }: InfoBoxProps) {
    return (
        <div className={styles.infoBox} style={style}>
            {children}
        </div>
    );
}
