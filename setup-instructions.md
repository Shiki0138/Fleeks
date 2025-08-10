# Google Forms + GAS セットアップ手順

## 1. Google Formsの作成

1. [Google Forms](https://forms.google.com)にアクセス
2. 新規フォーム作成
3. 以下の質問を追加：
   - お名前（短い回答・必須）
   - 会社名（短い回答）
   - メールアドレス（短い回答・必須）
   - 電話番号（短い回答）
   - Fleeksメンバーシップ（プルダウン・必須）
   - ご検討中のサービス（プルダウン・必須）
   - お問い合わせ内容（段落・必須）

## 2. スプレッドシート連携

1. フォームの「回答」タブをクリック
2. スプレッドシートアイコンをクリック
3. 「新しいスプレッドシートを作成」

## 3. GASスクリプトの設定

1. スプレッドシートから「拡張機能」→「Apps Script」
2. `gas-email-script.js`の内容をコピー&ペースト
3. `RECIPIENT_EMAIL`を実際のメールアドレスに変更
4. 保存（Ctrl+S）

## 4. トリガーの設定

1. Apps Scriptエディタで時計アイコン（トリガー）をクリック
2. 「トリガーを追加」
3. 以下を設定：
   - 実行する関数: `onFormSubmit`
   - イベントのソース: `スプレッドシートから`
   - イベントの種類: `フォーム送信時`
4. 保存

## 5. Entry IDの取得

1. Google Formsを開いて「送信」ボタンをクリック
2. リンクアイコンをクリックしてURLをコピー
3. 新しいタブでURLを開く
4. ページのソースを表示（右クリック → ページのソースを表示）
5. 各フィールドの`name="entry.XXXXXXXXX"`を探してメモ

## 6. HTMLフォームの更新

`consulting/index.html`の以下を更新：

1. `YOUR_GOOGLE_FORM_ACTION_URL`を置き換え
   ```
   https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse
   ```

2. 各`entry.XXXXXXXXX`を実際のIDに置き換え

## 7. テスト

1. Apps Scriptで`testEmail()`関数を実行してメール送信テスト
2. 実際のフォームから送信してテスト

## トラブルシューティング

- **権限エラー**: 初回実行時は権限承認が必要
- **メールが届かない**: 迷惑メールフォルダを確認
- **エラーログ**: Apps Scriptの「実行数」でエラーを確認