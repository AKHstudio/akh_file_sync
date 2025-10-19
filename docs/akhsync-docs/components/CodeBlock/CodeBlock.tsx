'use client';

import { useState } from 'react';
import styles from './CodeBlock.module.css';

interface CodeBlockProps {
    code: string;
    lang?: string;
}

export default function CodeBlock({ code, lang = 'code' }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('コピーに失敗しました:', err);
        }
    };

    return (
        <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
                <span className={styles.codeLang}>{lang}</span>
                <button className={`${styles.copyButton} ${copied ? styles.copied : ''}`} onClick={handleCopy}>
                    <span>{copied ? '✓' : '📋'}</span>
                    <span>{copied ? 'コピーしました' : 'コピー'}</span>
                </button>
            </div>
            <div className={styles.codeContent}>
                <code dangerouslySetInnerHTML={{ __html: code }} />
            </div>
        </div>
    );
}
