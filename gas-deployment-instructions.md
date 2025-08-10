# Google Apps Script (GAS) デプロイ手順

## 前提条件
- Googleアカウントを持っていること
- Google Driveへのアクセス権限があること

## 手順

### 1. Google Apps Scriptプロジェクトを作成

1. [Google Apps Script](https://script.google.com/)にアクセス
2. 「新しいプロジェクト」をクリック
3. プロジェクト名を「美容室コンサルティングフォーム」などに変更

### 2. 提供されたGASコードを貼り付け

1. デフォルトの`myFunction`を削除
2. 以下のコードを貼り付け（提供されたコードをそのまま使用）：

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID').getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // データを追加
    sheet.appendRow([
      new Date(),
      data.name,
      data.company,
      data.email,
      data.phone,
      'Fleeksメンバーではない', // デフォルト値
      data.planName,
      data.message
    ]);
    
    // メール送信
    const subject = `【お問い合わせ】${data.name}様より`;
    const body = `
お問い合わせがありました。

【お名前】${data.name}
【会社名】${data.company}
【メール】${data.email}
【電話番号】${data.phone}
【検討中のサービス】${data.planName}

【メッセージ】
${data.message}
    `;
    
    GmailApp.sendEmail('YOUR_EMAIL@gmail.com', subject, body);
    
    return ContentService.createTextOutput(JSON.stringify({status: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return doPost(e);
}
```

### 3. スプレッドシートを作成・設定

1. [Google Sheets](https://sheets.google.com)で新しいスプレッドシートを作成
2. シート名を「コンサルティング問い合わせ」などに設定
3. 1行目に以下のヘッダーを追加：
   - A1: タイムスタンプ
   - B1: お名前
   - C1: 会社名
   - D1: メールアドレス
   - E1: 電話番号
   - F1: Fleeksメンバーシップ
   - G1: ご検討中のサービス
   - H1: お問い合わせ内容

4. スプレッドシートのURLから`SPREADSHEET_ID`を取得
   - URL例: `https://docs.google.com/spreadsheets/d/XXXXXXXXXXXXX/edit`
   - `XXXXXXXXXXXXX`の部分がSPREADSHEET_ID

### 4. GASコードを更新

1. `YOUR_SPREADSHEET_ID`を実際のスプレッドシートIDに置き換え
2. `YOUR_EMAIL@gmail.com`を通知を受け取るメールアドレスに置き換え
3. ファイルを保存（Ctrl+S または Cmd+S）

### 5. Webアプリとしてデプロイ

1. 右上の「デプロイ」ボタンをクリック
2. 「新しいデプロイ」を選択
3. 歯車アイコンをクリックし、「ウェブアプリ」を選択
4. 以下の設定を行う：
   - **説明**: 「コンサルティングフォーム v1」など
   - **実行ユーザー**: 「自分」
   - **アクセス権**: 「全員」（匿名ユーザーを含む）
5. 「デプロイ」をクリック
6. 初回は権限の承認が必要：
   - 「アクセスを承認」をクリック
   - Googleアカウントを選択
   - 「詳細」→「安全でないページに移動」→「許可」

### 6. Web App URLを取得

1. デプロイが完了すると、Web App URLが表示される
2. URLをコピー（形式: `https://script.google.com/macros/s/XXXXXX/exec`）

### 7. HTMLファイルを更新

`consulting/index.html`の以下の行を更新：

```javascript
// Replace with your actual GAS Web App URL
const GAS_URL = 'YOUR_GAS_WEB_APP_URL';
```

↓

```javascript
// Replace with your actual GAS Web App URL
const GAS_URL = 'https://script.google.com/macros/s/XXXXXX/exec';
```

### 8. テスト

1. ブラウザでconsulting/index.htmlを開く
2. 「お問い合わせ」ボタンをクリック
3. フォームに入力して送信
4. スプレッドシートにデータが追加されることを確認
5. メールが届くことを確認

## トラブルシューティング

### CORSエラーが発生する場合
- GASのデプロイ設定で「アクセス権」が「全員」になっているか確認
- JavaScriptで`mode: 'no-cors'`が設定されているか確認

### データが保存されない場合
- スプレッドシートIDが正しいか確認
- GASプロジェクトがスプレッドシートへのアクセス権限を持っているか確認
- 実行ログでエラーを確認（表示→ログ）

### メールが届かない場合
- 迷惑メールフォルダを確認
- GmailAppの送信制限（1日100通）に達していないか確認
- メールアドレスが正しいか確認

## セキュリティに関する注意

- Web App URLは公開されるため、スパム対策を検討してください
- 必要に応じてreCAPTCHAなどの実装を検討してください
- 定期的にスプレッドシートをバックアップしてください