// Google Apps Script for Form Submission Email Notification
// このスクリプトをGoogle Formsに紐づいたスプレッドシートのスクリプトエディタに貼り付けてください

function onFormSubmit(e) {
  // 設定
  const RECIPIENT_EMAIL = 'your-email@example.com'; // 送信先メールアドレスを設定
  const SUBJECT = '【お問い合わせ】新規フォーム送信がありました';
  
  // フォームの回答を取得
  const responses = e.values;
  const timestamp = responses[0];
  const name = responses[1];
  const company = responses[2] || '未記入';
  const email = responses[3];
  const phone = responses[4] || '未記入';
  const membership = responses[5] || '未記入';
  const service = responses[6] || '未記入';
  const message = responses[7] || '未記入';
  
  // メール本文を作成
  const body = `
新しいお問い合わせがありました。

【送信日時】
${timestamp}

【お客様情報】
お名前: ${name}
会社名: ${company}
メールアドレス: ${email}
電話番号: ${phone}

【お問い合わせ内容】
Fleeksメンバーシップ: ${membership}
ご検討中のサービス: ${service}

お問い合わせ内容:
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
このメールは自動送信されています。
スプレッドシート: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  // HTMLメール本文（オプション）
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #00d4ff, #9c27b0); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .info-group { margin-bottom: 20px; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .label { font-weight: bold; color: #666; margin-bottom: 5px; }
    .value { color: #333; font-size: 16px; }
    .message-box { background: #fff; padding: 20px; border-left: 4px solid #00d4ff; margin-top: 20px; }
    .footer { text-align: center; color: #888; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">新規お問い合わせ</h2>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">美容室経営コンサルティング</p>
    </div>
    
    <div class="content">
      <div class="info-group">
        <div class="label">送信日時</div>
        <div class="value">${timestamp}</div>
      </div>
      
      <div class="info-group">
        <div class="label">お名前</div>
        <div class="value">${name}</div>
      </div>
      
      <div class="info-group">
        <div class="label">会社名</div>
        <div class="value">${company}</div>
      </div>
      
      <div class="info-group">
        <div class="label">メールアドレス</div>
        <div class="value"><a href="mailto:${email}">${email}</a></div>
      </div>
      
      <div class="info-group">
        <div class="label">電話番号</div>
        <div class="value">${phone}</div>
      </div>
      
      <div class="info-group">
        <div class="label">Fleeksメンバーシップ</div>
        <div class="value">${membership}</div>
      </div>
      
      <div class="info-group">
        <div class="label">ご検討中のサービス</div>
        <div class="value">${service}</div>
      </div>
      
      <div class="message-box">
        <div class="label">お問い合わせ内容</div>
        <div class="value" style="white-space: pre-wrap;">${message}</div>
      </div>
      
      <div class="footer">
        <p>このメールは自動送信されています。</p>
        <p><a href="${SpreadsheetApp.getActiveSpreadsheet().getUrl()}">スプレッドシートで詳細を確認</a></p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  // メールを送信
  try {
    MailApp.sendEmail({
      to: RECIPIENT_EMAIL,
      subject: SUBJECT,
      body: body,
      htmlBody: htmlBody,
      name: '美容室経営コンサルティング フォーム'
    });
    
    // お客様への自動返信メール（オプション）
    sendAutoReply(name, email, service);
    
  } catch (error) {
    console.error('メール送信エラー:', error);
  }
}

// お客様への自動返信メール
function sendAutoReply(name, email, service) {
  const subject = '【美容室経営コンサルティング】お問い合わせありがとうございます';
  
  const body = `
${name} 様

この度は、美容室経営コンサルティングにお問い合わせいただき、
誠にありがとうございます。

お問い合わせ内容を確認次第、担当者より
24時間以内にご連絡させていただきます。

【ご検討中のサービス】
${service}

なお、お急ぎの場合は下記までお電話ください。
TEL: 03-XXXX-XXXX（平日10:00-18:00）

今後ともよろしくお願いいたします。

━━━━━━━━━━━━━━━━━━━━━━━━━━━
美容室経営コンサルティング
AI Beauty Salon Consulting

Email: info@ai-salon-consulting.com
Web: https://example.com/consulting
━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  try {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body,
      name: '美容室経営コンサルティング',
      noReply: true
    });
  } catch (error) {
    console.error('自動返信メール送信エラー:', error);
  }
}

// テスト関数
function testEmail() {
  // テスト用のダミーデータ
  const testEvent = {
    values: [
      new Date().toLocaleString('ja-JP'),
      'テスト太郎',
      'テスト美容室',
      'test@example.com',
      '090-1234-5678',
      'Fleeksメンバー',
      '個別コンサルティング',
      'これはテストメッセージです。\n改行も含まれています。'
    ]
  };
  
  onFormSubmit(testEvent);
  console.log('テストメールを送信しました');
}