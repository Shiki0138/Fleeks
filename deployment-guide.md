# Xサーバーへの移行ガイド

## 1. 移行の全体フロー

### 現在の状況
- **現在**: Wixでホスティング中
- **ドメイン**: 既存のものを継続使用
- **移行先**: Xサーバー

### 移行手順

#### ステップ1: Xサーバーの準備
1. Xサーバーのコントロールパネルにログイン
2. ドメイン設定から、使用中のドメインを追加
3. SSL証明書（Let's Encrypt）を有効化

#### ステップ2: ファイルのアップロード
1. FTPクライアント（FileZilla推奨）またはXサーバーのファイルマネージャを使用
2. 接続情報:
   - ホスト: sv〇〇〇.xserver.jp（契約時のサーバー番号）
   - ユーザー名: FTPアカウント名
   - パスワード: FTPパスワード
   - ポート: 21（通常）または22（SFTP）

3. アップロード先:
   ```
   /home/[アカウント名]/[ドメイン名]/public_html/
   ```

4. アップロードするファイル:
   - index.html
   - styles.css
   - scripts.js
   - 画像ファイル（後述の手順で準備）
   - .htaccess（後述）

#### ステップ3: DNS切り替え
1. ドメイン管理会社にログイン
2. ネームサーバーをXサーバーのものに変更:
   ```
   ns1.xserver.jp
   ns2.xserver.jp
   ns3.xserver.jp
   ns4.xserver.jp
   ns5.xserver.jp
   ```
3. 反映まで最大48時間かかる場合あり

## 2. 広告コンバージョン改善のための実装

### Googleフォームの代替案（埋め込み型フォーム）
外部リンクによるコンバージョン計測の問題を解決するため、ページ内にフォームを実装します。

### オプション1: シンプルな埋め込みフォーム
- ページ内にHTMLフォームを直接実装
- フォーム送信時にサンクスページへ遷移
- Google Apps Script（GAS）でメール通知

### オプション2: フォーム作成サービス（推奨）
- **Typeform**、**JotForm**、**formrun** などを使用
- これらはコンバージョントラッキングに対応
- 埋め込みコードをLPに追加するだけ

## 3. トラッキング・分析ツールの実装

### Google Tag Manager (GTM) の設定
1. GTMアカウントを作成
2. コンテナを作成
3. 以下のタグを追加:
   - Google Analytics 4（GA4）
   - Facebook Pixel
   - コンバージョントラッキング

### Microsoft Clarity（ヒートマップ）の設定
- 無料で使える高機能ヒートマップツール
- セッション録画機能付き
- 離脱ポイントの可視化

### Facebook Pixel の設定
- Instagram広告のコンバージョン計測
- リターゲティング用オーディエンス作成
- イベント設定（ページビュー、フォーム送信等）

## 4. 必要な追加ファイル

### .htaccess（リダイレクト設定）
```apache
# HTTPSへのリダイレクト
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# wwwありなしの統一（wwwなしに統一する場合）
RewriteCond %{HTTP_HOST} ^www\.(.+)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

# キャッシュ設定
<IfModule mod_expires.c>
ExpiresActive On
ExpiresByType image/jpg "access plus 1 month"
ExpiresByType image/jpeg "access plus 1 month"
ExpiresByType image/png "access plus 1 month"
ExpiresByType text/css "access plus 1 week"
ExpiresByType application/javascript "access plus 1 week"
</IfModule>
```

## 5. 移行前のチェックリスト

- [ ] Xサーバーでドメイン設定完了
- [ ] SSL証明書の設定完了
- [ ] FTP接続情報の確認
- [ ] 現在のWixサイトのバックアップ
- [ ] GTMアカウントの作成
- [ ] GA4プロパティの作成
- [ ] Facebook Business Managerの準備
- [ ] フォーム送信先（メールアドレス等）の確認
- [ ] 画像ファイルの準備

## 6. 移行後の確認事項

- [ ] ページの表示確認（PC/スマホ）
- [ ] SSL証明書の動作確認
- [ ] フォーム送信テスト
- [ ] GTMタグの発火確認
- [ ] GA4でのデータ受信確認
- [ ] Facebook Pixelの動作確認
- [ ] Clarityの記録開始確認

## 注意事項

1. **DNS切り替えのタイミング**
   - 平日の業務時間内に実施
   - 切り替え前に新サーバーでの動作確認を推奨

2. **画像の最適化**
   - WebP形式への変換を推奨
   - 適切なサイズにリサイズ

3. **バックアップ**
   - 移行前に必ず現在のサイトをバックアップ
   - 新サーバーでも定期バックアップ設定

4. **テスト環境**
   - 可能であればサブドメイン（test.example.com等）で事前テスト