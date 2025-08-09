// 共通ヒートマップトラッキング機能
// Microsoft Clarity用の統一トラッキングシステム

(function () {
    'use strict';

    // ページタイプを自動判定
    function getPageType() {
        const path = window.location.pathname;
        if (path.includes('consulting')) return 'consulting_page';
        if (path.includes('contact-form')) return 'contact_form';
        if (path.includes('self')) return 'self_service';
        if (path.includes('tokusho')) return 'tokusho_page';
        if (path.includes('privacypolicy')) return 'privacy_policy';
        return 'landing_page';
    }

    // Clarityの初期化とカスタムイベント設定
    function initHeatmapTracking() {
        if (typeof clarity === 'undefined') {
            console.warn('Microsoft Clarity not loaded');
            return;
        }

        const pageType = getPageType();

        // ページタイプとユーザーセグメントを設定
        clarity('set', 'page_type', pageType);
        clarity('set', 'user_segment', 'beauty_professional');
        clarity('set', 'device_type', /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop');

        // CTAボタンのクリック追跡
        trackCTAButtons();

        // フォーム操作の追跡
        trackFormInteractions();

        // スクロール深度の追跡
        trackScrollDepth();

        // 滞在時間の追跡
        trackTimeOnPage();

        // 要素の表示追跡（ビューポート内に入った要素）
        trackElementVisibility();

        console.log('Heatmap tracking initialized for:', pageType);
    }

    // CTAボタンのクリック追跡
    function trackCTAButtons() {
        const ctaSelectors = [
            '.cta-button',
            'a[href*="google.com/forms"]',
            'button[type="submit"]',
            '.submit-btn',
            '.submit-button'
        ];

        ctaSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach((button, index) => {
                button.addEventListener('click', function (e) {
                    const buttonText = this.textContent.trim();
                    const section = this.closest('section')?.id || 'unknown';
                    const href = this.href || 'no-link';

                    clarity('event', 'cta_click', {
                        button_position: index + 1,
                        button_text: buttonText,
                        section: section,
                        href: href,
                        page_type: getPageType()
                    });

                    console.log('CTA clicked:', buttonText, 'in section:', section);
                });
            });
        });
    }

    // フォーム操作の追跡
    function trackFormInteractions() {
        // フォーム入力の追跡
        document.querySelectorAll('input, textarea, select').forEach(field => {
            // フォーカス時
            field.addEventListener('focus', function () {
                clarity('event', 'form_field_focus', {
                    field_name: this.name || this.id || 'unnamed',
                    field_type: this.type || this.tagName.toLowerCase(),
                    page_type: getPageType()
                });
            });

            // 入力完了時（blur）
            field.addEventListener('blur', function () {
                if (this.value.trim()) {
                    clarity('event', 'form_field_complete', {
                        field_name: this.name || this.id || 'unnamed',
                        field_type: this.type || this.tagName.toLowerCase(),
                        has_value: true,
                        page_type: getPageType()
                    });
                }
            });
        });

        // フォーム送信の追跡
        document.querySelectorAll('form').forEach((form, index) => {
            form.addEventListener('submit', function (e) {
                const formId = this.id || `form_${index}`;
                const formFields = this.querySelectorAll('input, textarea, select').length;

                clarity('event', 'form_submit', {
                    form_id: formId,
                    form_fields_count: formFields,
                    page_type: getPageType()
                });

                console.log('Form submitted:', formId);
            });
        });
    }

    // スクロール深度の追跡
    function trackScrollDepth() {
        let maxScroll = 0;
        let scrollMilestones = [25, 50, 75, 100];
        let reachedMilestones = [];

        function handleScroll() {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );

            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;

                // マイルストーンチェック
                scrollMilestones.forEach(milestone => {
                    if (scrollPercent >= milestone && !reachedMilestones.includes(milestone)) {
                        reachedMilestones.push(milestone);
                        clarity('event', 'scroll_depth', {
                            percent: milestone,
                            page_type: getPageType()
                        });
                        console.log('Scroll milestone reached:', milestone + '%');
                    }
                });
            }
        }

        // スクロールイベントをデバウンス
        let scrollTimeout;
        window.addEventListener('scroll', function () {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(handleScroll, 100);
        });
    }

    // 滞在時間の追跡
    function trackTimeOnPage() {
        const startTime = Date.now();
        const intervals = [30, 60, 120, 300]; // 30秒、1分、2分、5分
        let trackedIntervals = [];

        setInterval(() => {
            const timeOnPage = Math.floor((Date.now() - startTime) / 1000);

            intervals.forEach(interval => {
                if (timeOnPage >= interval && !trackedIntervals.includes(interval)) {
                    trackedIntervals.push(interval);
                    clarity('event', 'time_on_page', {
                        seconds: interval,
                        page_type: getPageType()
                    });
                    console.log('Time milestone:', interval + 's');
                }
            });
        }, 10000); // 10秒ごとにチェック

        // ページ離脱時の滞在時間記録
        window.addEventListener('beforeunload', function () {
            const totalTime = Math.floor((Date.now() - startTime) / 1000);
            clarity('event', 'page_exit', {
                total_time_seconds: totalTime,
                page_type: getPageType()
            });
        });
    }

    // 要素の表示追跡（重要なセクションがビューポートに入った時）
    function trackElementVisibility() {
        const importantSelectors = [
            '.hero',
            '.social-proof',
            '.problem-solution',
            '.benefits',
            '.offer',
            '.testimonial',
            '.stats',
            '.video-content',
            '.ai-dx'
        ];

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const elementId = entry.target.id || entry.target.className.split(' ')[0];
                    clarity('event', 'section_viewed', {
                        section: elementId,
                        page_type: getPageType()
                    });
                    console.log('Section viewed:', elementId);
                    observer.unobserve(entry.target); // 一度だけ記録
                }
            });
        }, {
            threshold: 0.5 // 50%が表示されたら記録
        });

        importantSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                observer.observe(element);
            });
        });
    }

    // エラー追跡
    function trackErrors() {
        window.addEventListener('error', function (e) {
            clarity('event', 'javascript_error', {
                message: e.message,
                filename: e.filename,
                line: e.lineno,
                page_type: getPageType()
            });
        });

        // Promise rejection エラー
        window.addEventListener('unhandledrejection', function (e) {
            clarity('event', 'promise_rejection', {
                reason: e.reason?.toString() || 'Unknown',
                page_type: getPageType()
            });
        });
    }

    // 初期化
    function init() {
        // DOMが読み込まれてから実行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initHeatmapTracking);
        } else {
            initHeatmapTracking();
        }

        // エラー追跡は即座に開始
        trackErrors();
    }

    // Microsoft Clarityが読み込まれるまで待機
    function waitForClarity() {
        if (typeof clarity !== 'undefined') {
            init();
        } else {
            setTimeout(waitForClarity, 100);
        }
    }

    waitForClarity();
})();