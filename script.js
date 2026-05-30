const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Sizin gizli məlumatlarınız (Bunu GitHub-a yükləməyin!)
const BOT_TOKEN = '8900082556:AAEpifqTxdKCqppa7lflczmD6IYzjk0iZTs';
const CHAT_ID = '8055987590';

app.post('/send-name', async (req, res) => {
    const gələnAd = req.body.name;

    if (!gələnAd) {
        return res.status(400).json({ error: 'Ad boş ola bilməz' });
    }

    const mesaj = `👋 Saytdan yeni ad gəldi: ${gələnAd}`;

    try {
        // Telegram API-na təhlükəsiz şəkildə serverdən sorğu göndərilir
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: mesaj
        });

        console.log(`Uğurlu: ${gələnAd} Telegram-a göndərildi.`);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Telegram-a göndərilərkən xəta:', error.message);
        res.status(500).json({ error: 'Telegram xətası' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda aktivdir. Termux-da işləyir...`);
});
          
