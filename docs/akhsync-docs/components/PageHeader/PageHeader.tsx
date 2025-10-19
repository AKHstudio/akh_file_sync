import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;
  description: string;
  isHero?: boolean;
}

export default function PageHeader({ title, description, isHero = false }: PageHeaderProps) {
  const className = isHero ? styles.hero : styles.pageHeader;

  return (
    <div className={className}>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
