// モバイルメニューの切り替え
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
let sidebarOverlay = document.querySelector('.sidebar-overlay');

// オーバーレイが存在しない場合は作成
if (!sidebarOverlay && sidebar) {
    sidebarOverlay = document.createElement('div');
    sidebarOverlay.className = 'sidebar-overlay';
    document.body.appendChild(sidebarOverlay);
}

if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('active');
        menuToggle.textContent = sidebar.classList.contains('open') ? '✕' : '☰';
    });

    // モバイルでサイドバーの外側をクリックしたら閉じる
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        menuToggle.textContent = '☰';
    });

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target) && 
            sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
            menuToggle.textContent = '☰';
        }
    });
}

// アクティブリンクのハイライト
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // 同じページ内のハッシュリンクの場合のみ処理
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            // すべてのリンクからactiveクラスを削除
            navLinks.forEach(l => l.classList.remove('active'));
            // クリックされたリンクにactiveクラスを追加
            link.classList.add('active');
        }
        
        // モバイルメニューを閉じる
        if (window.innerWidth <= 768 && sidebar && sidebarOverlay) {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
            if (menuToggle) {
                menuToggle.textContent = '☰';
            }
        }
    });
});

// アンカーリンクのスムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerOffset = 90;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observerでスクロールに基づいてアクティブリンクを変更（同じページのセクションのみ）
const sections = document.querySelectorAll('.content-section[id]');

if (sections.length > 0) {
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -66%',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${id}`) {
                        navLinks.forEach(l => {
                            const linkHref = l.getAttribute('href');
                            if (linkHref && linkHref.startsWith('#')) {
                                l.classList.remove('active');
                            }
                        });
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// 現在のページに基づいてアクティブなナビゲーションリンクを設定
window.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        // リンクが現在のページを指しているかチェック
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
        // index.htmlのハッシュのみのリンクもチェック
        if (currentPage === 'index.html' && linkHref && linkHref.startsWith('#')) {
            // これらはIntersection Observerで処理される
        }
    });
});

// コードブロックのコピー機能
document.addEventListener('DOMContentLoaded', () => {
    // すべてのコードブロックにコピーボタンを追加
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach((block) => {
        // 既にヘッダーがある場合はスキップ
        if (block.querySelector('.code-header')) return;
        
        const lang = block.getAttribute('data-lang') || 'code';
        const codeElement = block.querySelector('code');
        
        if (!codeElement) return;
        
        // 元のコードを保存（HTMLを保持）
        const codeHTML = codeElement.innerHTML;
        const codeText = codeElement.textContent;
        
        // ヘッダーを作成
        const header = document.createElement('div');
        header.className = 'code-header';
        
        const langLabel = document.createElement('span');
        langLabel.className = 'code-lang';
        langLabel.textContent = lang;
        
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<span>📋</span><span>コピー</span>';
        
        // コピー機能
        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(codeText);
                copyButton.innerHTML = '<span>✓</span><span>コピーしました</span>';
                copyButton.classList.add('copied');
                
                setTimeout(() => {
                    copyButton.innerHTML = '<span>📋</span><span>コピー</span>';
                    copyButton.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('コピーに失敗しました:', err);
                copyButton.innerHTML = '<span>✗</span><span>失敗</span>';
                
                setTimeout(() => {
                    copyButton.innerHTML = '<span>📋</span><span>コピー</span>';
                }, 2000);
            }
        });
        
        header.appendChild(langLabel);
        header.appendChild(copyButton);
        
        // コンテンツラッパーを作成
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'code-content';
        
        // 新しいcode要素を作成してHTMLを保持
        const newCodeElement = document.createElement('code');
        newCodeElement.innerHTML = codeHTML;
        contentWrapper.appendChild(newCodeElement);
        
        // ブロックを再構築
        block.innerHTML = '';
        block.appendChild(header);
        block.appendChild(contentWrapper);
    });
});