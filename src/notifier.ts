import dotenv from 'dotenv'
dotenv.config()

// 使用动态导入替代CommonJS的require
let fetch: any;

// 初始化函数，在使用前异步加载fetch
async function initFetch() {
  if (!fetch) {
    const module = await import('node-fetch');
    fetch = module.default;
  }
  return fetch;
}

export async function sendAlert(message: string) {
    const webhookUrl = process.env.BOT_WEBHOOK_URL!
    const chatId = process.env.TELEGRAM_CHAT_ID!
  
    try {
      // 确保fetch已加载
      const fetchFn = await initFetch();
      
      const res = await fetchFn(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      })
  
      const json = await res.json() as { ok: boolean, [key: string]: any }
      if (!json.ok) {
        console.error('Telegram 推送失败:', json)
      } else {
        console.log('已推送到 Telegram')
      }
    } catch (err) {
      console.error('推送出错:', err)
    }
  }