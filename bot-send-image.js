const { createCanvas, loadImage } = require('canvas');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot('6507147152:AAGeGe35kJA7zdAL00DsNuqT3HC3SPs65Po', {
  polling: true,
});

async function createCustomImage(config) {
  const {
    width = 800,
    height = 400,
    text = 'Hello',
    backgroundColor = '#ffffff',
    textColor = '#000000',
    fontSize = 40,
    backgroundImage = null,
  } = config;

  // Tạo canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Vẽ background
  if (backgroundImage) {
    // Nếu có ảnh nền
    const image = await loadImage(backgroundImage);
    ctx.drawImage(image, 0, 0, width, height);
  } else {
    // Nếu không có ảnh nền thì vẽ màu nền
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }

  // Cấu hình text
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Vẽ text ở giữa canvas
  ctx.fillText(text, width / 2, height / 2);

  // Thêm viền cho text
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.strokeText(text, width / 2, height / 2);

  return canvas.toBuffer('image/png');
}

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  if (msg.text && msg.text.startsWith('/image')) {
    try {
      const imageBuffer = await createCustomImage({
        text: 'Xin chào từ Telegram Bot!',
        backgroundColor: '#f0f0f0',
        textColor: '#ff0000',
        fontSize: 50,
        // backgroundImage: 'đường_dẫn_đến_ảnh_nền.jpg' // Nếu muốn dùng ảnh nền
      });

      await bot.sendPhoto(chatId, imageBuffer);
    } catch (error) {
      console.error('Lỗi:', error);
      bot.sendMessage(chatId, 'Có lỗi xảy ra khi tạo ảnh');
    }
  }
});
