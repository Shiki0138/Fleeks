/**
 * Fleeks - メインJavaScript
 * 基本機能の実装
 */

document.addEventListener('DOMContentLoaded', function() {
    // ハンバーガーメニューの制御
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // メニュー開閉時にスクロールを制御
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // メニュー内のリンククリック時にメニューを閉じる
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // スクロール時のヘッダー変更
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        
        // 初期状態の確認
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        }
    }
    
    // スムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 現在表示中のセクションをナビゲーションにアクティブ表示
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightNavigation() {
        const scrollPosition = window.scrollY + window.innerHeight / 4;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation(); // 初期状態でもハイライト
    
    // FAQアコーディオン
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                // 現在開いているアイテムを閉じる（オプション）
                const currentlyActive = document.querySelector('.faq-item.active');
                if (currentlyActive && currentlyActive !== item) {
                    currentlyActive.classList.remove('active');
                    const activeIcon = currentlyActive.querySelector('.faq-toggle i');
                    if (activeIcon) {
                        activeIcon.classList.remove('fa-minus');
                        activeIcon.classList.add('fa-plus');
                    }
                }
                
                // クリックされたアイテムの状態を切り替え
                item.classList.toggle('active');
                
                // アイコンの切り替え
                const icon = question.querySelector('.faq-toggle i');
                if (icon) {
                    if (item.classList.contains('active')) {
                        icon.classList.remove('fa-plus');
                        icon.classList.add('fa-minus');
                    } else {
                        icon.classList.remove('fa-minus');
                        icon.classList.add('fa-plus');
                    }
                }
            });
        }
    });
    
    // フローティングCTAボタンの表示制御
    const floatingCta = document.querySelector('.floating-cta');
    const heroSection = document.getElementById('hero');
    const contactSection = document.getElementById('contact');
    
    if (floatingCta && heroSection && contactSection) {
        window.addEventListener('scroll', function() {
            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
            const contactTop = contactSection.offsetTop;
            const scrollPosition = window.scrollY + window.innerHeight;
            
            // ヒーローセクションを過ぎたら表示、コンタクトセクションに到達したら非表示
            if (window.scrollY > heroBottom && scrollPosition < contactTop) {
                floatingCta.style.display = 'block';
            } else {
                floatingCta.style.display = 'none';
            }
        });
    }
    
    // 離脱防止ポップアップ
    const exitPopup = document.getElementById('exit-intent-popup');
    const closePopupBtn = document.querySelector('.close-popup');
    
    if (exitPopup && closePopupBtn) {
        // 閉じるボタンのイベント
        closePopupBtn.addEventListener('click', function() {
            exitPopup.classList.remove('active');
            
            // セッションストレージに記録して再表示を防止
            sessionStorage.setItem('popup_closed', 'true');
        });
        
        // マウスが画面上部に移動したときにポップアップ表示
        document.addEventListener('mouseleave', function(e) {
            // モバイルでの誤検知防止
            if (e.clientY <= 0 && !sessionStorage.getItem('popup_closed') && window.innerWidth > 768) {
                // セッション中に一度だけ表示
                exitPopup.classList.add('active');
            }
        });
        
        // モバイルでの離脱検知（スクロール距離による）
        let lastScrollTop = 0;
        let exitIntentCounter = 0;
        
        window.addEventListener('scroll', function() {
            const st = window.pageYOffset || document.documentElement.scrollTop;
            
            // 上方向へのスクロールが10回以上あれば離脱意図とみなす
            if (st < lastScrollTop) {
                exitIntentCounter++;
                
                if (exitIntentCounter >= 10 && !sessionStorage.getItem('popup_closed') && window.innerWidth <= 768) {
                    exitPopup.classList.add('active');
                    exitIntentCounter = 0;
                }
            } else {
                exitIntentCounter = 0;
            }
            
            lastScrollTop = st <= 0 ? 0 : st;
        }, false);
    }
    
    // form.runの初期化と設定
    if (typeof Formrun === 'function') {
        // メインの問い合わせフォーム
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            const formrunId = contactForm.getAttribute('action').split('/').pop();
            
            new Formrun(contactForm, {
                formKey: formrunId,
                beforeSubmit: function() {
                    // 送信前の処理
                    const submitButton = contactForm.querySelector('button[type="submit"]');
                    if (submitButton) {
                        const originalText = submitButton.textContent;
                        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';
                        submitButton.disabled = true;
                        
                        // 送信完了後に元に戻す処理を予約
                        setTimeout(function() {
                            submitButton.innerHTML = originalText;
                            submitButton.disabled = false;
                        }, 5000); // タイムアウト（送信失敗時用）
                    }
                    
                    // フォームに送信中クラスを追加
                    contactForm.classList.add('js-form-running');
                    
                    return true; // trueを返すと送信処理が続行
                },
                onSuccess: function() {
                    // 成功時の処理
                    const submitButton = contactForm.querySelector('button[type="submit"]');
                    if (submitButton) {
                        submitButton.innerHTML = '<i class="fas fa-check"></i> 送信完了';
                    }
                    
                    // フォームを非表示にし、完了メッセージを表示
                    contactForm.innerHTML = `
                        <div class="form-success">
                            <i class="fas fa-check-circle" style="font-size: 48px; color: var(--success-color); margin-bottom: 20px;"></i>
                            <h3>お問い合わせありがとうございます</h3>
                            <p>担当者より1営業日以内にご連絡いたします。</p>
                        </div>
                    `;
                    
                    // Google Analytics イベント送信（実装時に有効化）
                    /*
                    if (typeof gtag === 'function') {
                        gtag('event', 'form_submit', {
                            'event_category': 'Contact',
                            'event_label': 'Inquiry'
                        });
                    }
                    */
                    
                    // クラスを解除
                    contactForm.classList.remove('js-form-running');
                },
                onError: function(errors) {
                    // エラー時の処理
                    console.error('Form errors:', errors);
                    
                    const submitButton = contactForm.querySelector('button[type="submit"]');
                    if (submitButton) {
                        submitButton.innerHTML = '送信エラー。再度お試しください';
                        submitButton.disabled = false;
                    }
                    
                    // クラスを解除
                    contactForm.classList.remove('js-form-running');
                }
            });
        }
        
        // PDFダウンロード用の小さいフォーム
        const miniForm = document.querySelector('.mini-form');
        if (miniForm) {
            const formrunId = miniForm.getAttribute('action').split('/').pop();
            
            new Formrun(miniForm, {
                formKey: formrunId,
                onSuccess: function() {
                    // 成功時の処理
                    miniForm.innerHTML = `
                        <div class="form-success">
                            <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
                            <p>PDFを送信しました！<br>メールをご確認ください</p>
                        </div>
                    `;
                    
                    // 5秒後にポップアップを閉じる
                    setTimeout(function() {
                        const exitPopup = document.getElementById('exit-intent-popup');
                        if (exitPopup) {
                            exitPopup.classList.remove('active');
                        }
                    }, 5000);
                }
            });
        }
    }
    
    // URLパラメータの取得とフォームへの反映
    function getUrlParams() {
        const params = {};
        const queryString = window.location.search;
        
        if (queryString) {
            const urlParams = new URLSearchParams(queryString);
            for (const [key, value] of urlParams.entries()) {
                params[key] = value;
            }
        }
        
        return params;
    }
    
    // UTMパラメータをフォームに反映
    function setUtmParams() {
        const params = getUrlParams();
        const contactForm = document.querySelector('.contact-form');
        
        if (contactForm) {
            // UTMパラメータの保存
            for (const [key, value] of Object.entries(params)) {
                if (key.startsWith('utm_')) {
                    localStorage.setItem(key, value);
                }
            }
            
            // 隠しフィールドの作成と値の設定
            const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
            
            utmParams.forEach(param => {
                let value = params[param] || localStorage.getItem(param);
                
                if (value) {
                    let hiddenField = document.createElement('input');
                    hiddenField.type = 'hidden';
                    hiddenField.name = param;
                    hiddenField.value = value;
                    contactForm.appendChild(hiddenField);
                }
            });
            
            // リファラー情報も保存
            if (document.referrer) {
                let refField = document.createElement('input');
                refField.type = 'hidden';
                refField.name = 'referer';
                refField.value = document.referrer;
                contactForm.appendChild(refField);
            }
        }
    }
    
    // UTMパラメータの適用
    setUtmParams();
});
