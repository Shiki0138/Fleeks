# トラッキング設定ガイド

## 1. Google Tag Manager (GTM) の設定

### GTMアカウント作成
1. [Google Tag Manager](https://tagmanager.google.com/)にアクセス
2. 「アカウントを作成」をクリック
3. アカウント名: 「Fleeks」
4. コンテナ名: 「www.shiki-stagram.com」（実際のドメイン）
5. ターゲットプラットフォーム: 「ウェブ」

### 設定が必要なタグ

#### 1. Google Analytics 4（GA4）
```javascript
タグタイプ: Google アナリティクス: GA4 設定
測定 ID: G-XXXXXXXXXX（GA4プロパティから取得）
```

#### 2. GA4 イベント - フォーム送信
```javascript
タグタイプ: Google アナリティクス: GA4 イベント
イベント名: form_submit
イベントパラメータ:
  - form_type: contact
  - form_location: {{Page Path}}
```

#### 3. Facebook Pixel - 基本設定
```javascript
タグタイプ: カスタム HTML
<script>
fbq('track', 'ViewContent', {
    content_name: 'Fleeks Landing Page',
    content_category: 'Online Salon'
});
</script>
```

#### 4. Facebook Pixel - フォーム送信
```javascript
タグタイプ: カスタム HTML
<script>
fbq('track', 'Lead', {
    content_name: 'Fleeks Application',
    content_category: 'Online Salon',
    value: 7980,
    currency: 'JPY'
});
</script>
```

### トリガーの設定

#### 1. フォーム送信トリガー
```javascript
トリガータイプ: フォームの送信
このトリガーの発生場所: 一部のフォーム
条件: Form ID equals contact-form
```

#### 2. CTA クリックトリガー
```javascript
トリガータイプ: すべての要素のクリック
このトリガーの発生場所: 一部のクリック
条件: Click Classes contains cta-button
```

## 2. コンバージョン計測の改善

### 埋め込みフォームの実装オプション

#### オプション1: formrun（推奨）
- 日本製で使いやすい
- 無料プランあり
- GTM連携が簡単

```html
<!-- formrunの埋め込みコード例 -->
<div class="formrun-embed" data-formrun-form="@YOUR_FORM_ID"></div>
<script src="https://sdk.run/v1/formrun.js"></script>
```

#### オプション2: Google Apps Script (GAS) + カスタムフォーム
メリット：完全無料、カスタマイズ自由
デメリット：実装に多少の技術力が必要

### 実装コード（GASを使用する場合）

```javascript
// フォーム送信処理
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // GTMにイベント送信
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event': 'form_submit',
        'form_type': 'contact',
        'form_data': data
    });
    
    // Facebook Pixelイベント
    fbq('track', 'Lead', {
        content_name: 'Fleeks Application',
        value: 7980,
        currency: 'JPY'
    });
    
    // GASへ送信
    try {
        const response = await fetch('YOUR_GAS_WEBHOOK_URL', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // サンクスページへリダイレクト
        window.location.href = '/thanks.html';
    } catch (error) {
        console.error('Error:', error);
    }
});
```

## 3. Microsoft Clarity（ヒートマップ）

### 設定手順
1. [Microsoft Clarity](https://clarity.microsoft.com/)にアクセス
2. 無料アカウント作成
3. プロジェクト作成
4. トラッキングコードを取得（既にindex.htmlに実装済み）

### 確認できるデータ
- ヒートマップ（クリック、スクロール）
- セッション録画
- 離脱ポイント分析
- デバイス別の行動

## 4. Instagram広告のPDCA改善

### 1. UTMパラメータの活用
広告URLに以下を追加：
```
?utm_source=instagram&utm_medium=paid&utm_campaign=fleeks_2024
```

### 2. カスタムイベントの設定
```javascript
// 価格セクション到達
if (isElementInViewport(document.querySelector('#offer'))) {
    gtag('event', 'view_pricing', {
        'event_category': 'engagement',
        'event_label': 'pricing_section'
    });
    
    fbq('track', 'ViewContent', {
        content_name: 'Pricing Section',
        content_ids: ['fleeks_monthly'],
        value: 7980,
        currency: 'JPY'
    });
}
```

### 3. A/Bテスト用の設定
Google Optimizeの代替として、簡易的なA/Bテストの実装：

```javascript
// ヘッドラインのA/Bテスト例
const variants = [
    "投稿しても集客できない...\nその悩み、解決します。",
    "Instagram集客の悩み、\n今すぐ解決できます。"
];

const selectedVariant = Math.random() < 0.5 ? 0 : 1;
document.querySelector('.hero-title').innerHTML = variants[selectedVariant];

// GTMにバリアント情報を送信
dataLayer.push({
    'event': 'ab_test_impression',
    'test_name': 'hero_headline',
    'variant': selectedVariant
});
```

## 5. レポート設定

### GA4カスタムレポート
作成すべきレポート：
1. 流入元別コンバージョン率
2. デバイス別離脱率
3. ページ滞在時間とコンバージョンの相関
4. CTAクリック率

### Facebook広告マネージャー
カスタムコンバージョン設定：
1. フォーム送信完了
2. 価格セクション到達
3. 動画再生（実装時）

## 6. 実装後のチェックリスト

- [ ] GTMコンテナIDを実際のIDに置き換え
- [ ] Facebook Pixel IDを実際のIDに置き換え
- [ ] Microsoft Clarity IDを実際のIDに置き換え
- [ ] GA4測定IDを設定
- [ ] フォーム送信先URL（GASまたはformrun）を設定
- [ ] GTMプレビューモードでタグ発火確認
- [ ] Facebook Pixel Helperで動作確認
- [ ] Clarityでセッション記録確認
- [ ] テストフォーム送信でコンバージョン確認

## 注意事項

1. **プライバシーポリシー**
   - Cookie使用について明記
   - トラッキングツールの使用を記載

2. **GDPR/個人情報保護**
   - 必要に応じてCookie同意バナーを実装

3. **パフォーマンス**
   - トラッキングスクリプトは非同期で読み込み
   - Core Web Vitalsへの影響を最小限に