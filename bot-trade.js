const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const bot = new TelegramBot('6507147152:AAGeGe35kJA7zdAL00DsNuqT3HC3SPs65Po', {
  polling: true,
});

// Lắng nghe lệnh /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  console.log(msg);

  const welcomeMessage = `Chào mừng đến với bot trade! Vui lòng chọn một hành động bên dưới:`;

  // Inline keyboard giống giao diện trong hình
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Buy', callback_data: 'buy' },
          { text: 'Sell', callback_data: 'sell' },
        ],
        [
          { text: 'Positions', callback_data: 'positions' },
          { text: 'Limit Orders', callback_data: 'limit_orders' },
        ],
        [
          { text: 'DCA Orders', callback_data: 'dca_orders' },
          { text: 'Copy Trade', callback_data: 'copy_trade' },
        ],
        [
          { text: 'New Pairs', callback_data: 'new_pairs' },
          { text: 'Settings', callback_data: 'settings' },
        ],
        [
          { text: 'Bridge', callback_data: 'bridge' },
          { text: 'Withdraw', callback_data: 'withdraw' },
        ],
        [
          { text: 'Help', callback_data: 'help' },
          { text: '🔄 Refresh', callback_data: 'refresh' },
        ],
      ],
    },
  };

  // Gửi tin nhắn với các button
  bot.sendMessage(chatId, welcomeMessage, options);
});

// Xử lý callback từ inline keyboard
bot.on('callback_query', (query) => {
  // const chatId = query.message.chat.id;
  const chatId = -1002320692786;
  console.log('chatId: ', chatId);
  const action = query.data;
  console.log('action: ', action);

  switch (action) {
    case 'buy':
      bot.sendMessage(chatId, 'Bạn chọn "Buy". Vui lòng nhập thông tin mua.');
      break;
    case 'sell':
      bot.sendMessage(chatId, 'Bạn chọn "Sell". Vui lòng nhập thông tin bán.');
      break;
    case 'positions':
      bot.sendMessage(chatId, 'Hiển thị các vị trí hiện tại.');
      break;
    case 'limit_orders':
      bot.sendMessage(chatId, 'Hiển thị các lệnh giới hạn.');
      break;
    case 'dca_orders':
      bot.sendMessage(chatId, 'Hiển thị các lệnh DCA.');
      break;
    case 'copy_trade':
      bot.sendMessage(chatId, 'Chức năng Copy Trade đang được phát triển.');
      break;
    case 'new_pairs':
      bot.sendMessage(chatId, 'Hiển thị các cặp coin mới.');
      break;
    case 'settings':
      bot.sendMessage(chatId, 'Truy cập cài đặt.');
      break;
    case 'bridge':
      bot.sendMessage(chatId, 'Chức năng Bridge đang được xử lý.');
      break;
    case 'withdraw':
      bot.sendMessage(chatId, 'Rút tiền.');
      break;
    case 'help':
      bot.sendMessage(chatId, 'Bạn cần trợ giúp? Hãy đặt câu hỏi!');
      break;
    case 'refresh':
      bot.sendMessage(chatId, 'Làm mới số dư của bạn...');
      break;
    default:
      bot.sendMessage(chatId, 'Hành động không xác định.');
  }
});

// Xử lý các lệnh từ Hamburger Menu
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    'Hướng dẫn sử dụng bot:\n1. /start - Bắt đầu\n2. /trade - Thực hiện giao dịch\n3. /balance - Xem số dư'
  );
});

bot.onText(/\/trade/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Bạn có thể giao dịch tại đây.');
});

bot.onText(/\/balance/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Số dư của bạn là 100 SOL.');
});

bot.onText(/\/temp/, (msg) => {
  // Read the template file
  const templatePath = path.join(__dirname, 'templates', 'temp.hbs');
  const template = fs.readFileSync(templatePath, 'utf8');

  // Compile the template
  const compiledTemplate = handlebars.compile(template);

  // Data to pass to template
  const data = {
    imageUrl: path.join(__dirname, 'images', 'your-image.jpg'),
  };

  // Render the template
  const html = compiledTemplate(data);

  // Send the HTML message
  bot.sendPhoto(msg.chat.id, data.imageUrl, {
    caption: 'Your template caption here',
    parse_mode: 'HTML',
  });
});

console.log('Bot is running...');
