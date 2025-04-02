// 3つの集客スキルの画像を生成するためのスクリプト
const canvas = document.createElement('canvas');
canvas.width = 600;
canvas.height = 400;
const ctx = canvas.getContext('2d');

// マーケティングスキル画像
function drawMarketingSkill() {
    // 背景
    ctx.fillStyle = '#8a2be2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // タイトル
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('マーケティングスキル', canvas.width/2, 80);
    
    // アイコン（簡易的な図形で表現）
    ctx.beginPath();
    ctx.arc(canvas.width/2, 180, 60, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    
    ctx.fillStyle = '#8a2be2';
    ctx.font = 'bold 50px Arial';
    ctx.fillText('M', canvas.width/2, 200);
    
    // 説明テキスト
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText('顧客心理に基づいた', canvas.width/2, 280);
    ctx.fillText('効果的な集客戦略', canvas.width/2, 310);
    
    return canvas.toDataURL('image/png');
}

// 接客心理スキル画像
function drawCustomerPsychologySkill() {
    // 背景
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // タイトル
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('接客心理スキル', canvas.width/2, 80);
    
    // アイコン（簡易的な図形で表現）
    ctx.beginPath();
    ctx.arc(canvas.width/2, 180, 60, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 50px Arial';
    ctx.fillText('P', canvas.width/2, 200);
    
    // 説明テキスト
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText('顧客の期待を理解し', canvas.width/2, 280);
    ctx.fillText('信頼関係を構築する技術', canvas.width/2, 310);
    
    return canvas.toDataURL('image/png');
}

// ビジネス戦略スキル画像
function drawBusinessStrategySkill() {
    // 背景
    ctx.fillStyle = '#4ecdc4';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // タイトル
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ビジネス戦略スキル', canvas.width/2, 80);
    
    // アイコン（簡易的な図形で表現）
    ctx.beginPath();
    ctx.arc(canvas.width/2, 180, 60, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    
    ctx.fillStyle = '#4ecdc4';
    ctx.font = 'bold 50px Arial';
    ctx.fillText('B', canvas.width/2, 200);
    
    // 説明テキスト
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText('長期的な成長を実現する', canvas.width/2, 280);
    ctx.fillText('ビジネスモデルの構築', canvas.width/2, 310);
    
    return canvas.toDataURL('image/png');
}

// 画像の生成と保存
const marketingSkillImage = drawMarketingSkill();
const customerPsychologySkillImage = drawCustomerPsychologySkill();
const businessStrategySkillImage = drawBusinessStrategySkill();

// 画像をダウンロードするためのリンクを作成
function downloadImage(dataUrl, filename) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 画像をダウンロード
downloadImage(marketingSkillImage, 'marketing_skill.png');
downloadImage(customerPsychologySkillImage, 'customer_psychology_skill.png');
downloadImage(businessStrategySkillImage, 'business_strategy_skill.png');
