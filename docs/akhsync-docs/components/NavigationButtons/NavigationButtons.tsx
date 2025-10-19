import Link from 'next/link';
import styles from './NavigationButtons.module.css';

interface NavigationButtonsProps {
  prev?: {
    href: string;
    label: string;
    title: string;
  };
  next?: {
    href: string;
    label: string;
    title: string;
  };
}

export default function NavigationButtons({ prev, next }: NavigationButtonsProps) {
  return (
    <div className={styles.navigationButtons}>
      {prev ? (
        <Link href={prev.href} className={styles.navButton}>
          <div>
            <div className={styles.navButtonLabel}>{prev.label}</div>
            <div className={styles.navButtonTitle}>{prev.title}</div>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next && (
        <Link href={next.href} className={`${styles.navButton} ${styles.next}`}>
          <div>
            <div className={styles.navButtonLabel}>{next.label}</div>
            <div className={styles.navButtonTitle}>{next.title}</div>
          </div>
        </Link>
      )}
    </div>
  );
}
