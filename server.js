const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const {
  QRCodeStyling,
} = require('qr-code-styling/lib/qr-code-styling.common.js');
const nodeCanvas = require('canvas');
const { JSDOM } = require('jsdom');
const TelegramBot = require('node-telegram-bot-api');
const app = express();
const port = 3009;

app.use(express.json());

async function sendImage(buffer) {
  const bot = new TelegramBot(
    '6507147152:AAGeGe35kJA7zdAL00DsNuqT3HC3SPs65Po',
    { polling: true }
  );
  const chatId = '1262915258';
  bot.sendPhoto(chatId, buffer, {
    caption: '',
  });
}

const generateImage = async () => {
  const canvas = createCanvas(600, 600);
  const ctx = canvas.getContext('2d');

  const backgroundImage = await loadImage(
    'https://raidenx.io/static/media/Flex-ver-2-min.1eb37bc624e0617bf989.png'
  );
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  // Hàm vẽ bubble
  function drawBubble(x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fill();
  }

  // Hàm vẽ box
  function drawBox(text, x, y, width, height) {
    ctx.fillStyle = 'rgba(255, 77, 77, 0.1)';
    ctx.roundRect(x, y, width, height, 10);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, x + width / 2, y + height / 2 + 6);
  }

  // Hàm vẽ stats box
  function drawStatsBox(x, y) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.roundRect(x, y, 300, 120, 15);
    ctx.fill();

    const stats = [
      ['Total Invested', '0.00458$'],
      ['Total Sold', '--$'],
      ['Total Loss', '-0.0007301$'],
    ];

    stats.forEach((stat, index) => {
      ctx.fillStyle = '#999';
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(stat[0], x + 20, y + 30 + index * 35);

      ctx.fillStyle = index === 2 ? '#ff4d4d' : 'white';
      ctx.textAlign = 'right';
      ctx.fillText(stat[1], x + 280, y + 30 + index * 35);
    });
  }

  // Hàm vẽ referral box
  async function drawReferralBox(x, y, referralCode) {
    const boxWidth = 360;
    const boxHeight = 100;
    // Tính toán vị trí x để căn giữa box
    const centerX = (canvas.width - boxWidth) / 2;

    // Vẽ background box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.roundRect(centerX, y, boxWidth, boxHeight, 8);
    ctx.fill();

    // Vẽ QR code
    const qrSize = 72;
    const qrX = centerX + 20;
    const qrY = y + 14; // Căn giữa theo chiều dọc trong box

    // Vẽ khung cho QR
    ctx.strokeStyle = '#666';
    ctx.strokeRect(qrX, qrY, qrSize, qrSize);

    // Vẽ QR code vào trong khung
    const qrCode = await generateQR(referralCode);
    const qrCodeImage = await loadImage(qrCode);
    ctx.drawImage(qrCodeImage, qrX, qrY, qrSize, qrSize);

    // Vẽ text content
    const textX = qrX + qrSize + 20;

    ctx.fillStyle = '#999999';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('REFERRAL CODE', textX, y + 30);

    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.fillText(referralCode, textX, y + 50);

    ctx.fillStyle = '#999999';
    ctx.fillText('Refer other and earn up to 40%', textX, y + 70);
  }

  try {
    // Vẽ background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(40, 23, 28, 1)');
    gradient.addColorStop(1, 'rgba(19, 14, 17, 1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Vẽ các bubble trang trí
    drawBubble(360, 20, 40);
    drawBubble(30, 100, 30);
    drawBubble(310, 520, 50);

    // Vẽ text content
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('$CHILLFRTHR', canvas.width / 2, 120);

    // Vẽ percentage
    ctx.fillStyle = '#ff4d4d';
    ctx.font = '72px Arial';
    ctx.fillText(
      Number(Number(Math.random() * 10).toFixed(2)).toFixed(2) + ' %',
      canvas.width / 2,
      200
    );

    // Vẽ PnL box
    drawBox('Current PnL: -0.041566 SUI', 50, 230, 300, 50);

    // Vẽ stats box
    drawStatsBox(50, 300);

    // Vẽ referral box
    drawReferralBox(50, 450);

    // Vẽ timestamp
    ctx.fillStyle = '#666';
    ctx.font = '14px Arial';
    ctx.fillText('Time Stamp: 2024-12-17 04:20 (UTC)', canvas.width / 2, 570);

    // Chuyển canvas thành buffer
    const buffer = canvas.toBuffer('image/png');

    return buffer;
    // await sendImage(buffer);
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
};

const customImage = async (data) => {
  const {
    symbol,
    pnlPercentage,
    currentPnL,
    currency,
    totalInvested,
    totalSold,
    totalProfit,
    referralCode,
  } = data;
  const canvas = createCanvas(584.44, 644);
  const ctx = canvas.getContext('2d');

  // Load and draw background
  const urls = [
    'https://raidenx.io/static/media/Flex-ver-2-min.1eb37bc624e0617bf989.png',
    'https://raidenx.io/static/media/Flex-ver-1-min.bb643c3246758bab8b33.png',
  ];
  const backgroundImage = await loadImage(
    pnlPercentage < 0 ? urls[0] : urls[1]
  );
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  // Set text styles
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';

  const raidenxImage = await loadImage('./raidenx.png');
  const imageWidth = 75;
  const imageHeight = 24;
  // Tính toán vị trí x để căn giữa ảnh
  const x = (canvas.width - imageWidth) / 2;
  ctx.drawImage(raidenxImage, x, 60, imageWidth, imageHeight);
  // Draw symbol
  ctx.font = 'bold 24px Arial';
  ctx.fillText(symbol, canvas.width / 2, 120);

  // Draw PnL percentage
  ctx.font = 'bold 80px Arial';
  ctx.fillStyle = pnlPercentage >= 0 ? '#4ADE80' : '#ff6676'; // Green if positive, red if negative
  ctx.fillText(`${pnlPercentage.toFixed(2)}%`, canvas.width / 2, 200);

  // Draw Current PnL box
  const pnlBoxStyle = {
    width: 200,
    height: 36,
    borderRadius: 4,
  };

  // Tính toán vị trí để box nằm giữa
  const boxX = (canvas.width - pnlBoxStyle.width) / 2;
  const boxY = 220;

  // Vẽ background box với màu đen transparent
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.beginPath();
  ctx.roundRect(
    boxX,
    boxY,
    pnlBoxStyle.width,
    pnlBoxStyle.height,
    pnlBoxStyle.borderRadius
  );
  ctx.fill();

  // Vẽ text riêng biệt
  ctx.font = '14px Arial';
  ctx.textAlign = 'left';

  // Vẽ "Current PnL" với màu trắng
  ctx.fillStyle = '#FFFFFF';
  const pnlTextWidth = ctx.measureText('Current PnL').width;
  ctx.fillText('Current PnL:', boxX + 10, boxY + 24);

  // Vẽ giá trị với màu tùy thuộc vào positive/negative
  ctx.fillStyle = currentPnL >= 0 ? '#4ADE80' : '#ff6676';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(
    `${currentPnL} ${currency}`,
    boxX + pnlTextWidth + 25,
    boxY + 24
  );

  function drawInvestmentDetails(ctx, x, y) {
    // Background box cho toàn bộ khu vực
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.roundRect(x, y, 360, 120, 8);
    ctx.fill();

    const stats = [
      ['Total Invested', `${totalInvested} ${currency}`],
      ['Total Sold', `${totalSold} ${currency}`],
      ['Total Profit', `${totalProfit} ${currency}`],
    ];

    stats.forEach((stat, index) => {
      // Label (bên trái)
      ctx.fillStyle = '#999999'; // Màu xám cho label
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(stat[0], x + 20, y + 35 + index * 35);

      // Value (bên phải)
      ctx.textAlign = 'right';
      // Nếu là Total Profit và giá trị > 0, dùng màu xanh
      if (index === 2 && parseFloat(stat[1]) > 0) {
        ctx.fillStyle = '#4ADE80'; // Màu xanh cho profit dương
      } else if (index === 2 && parseFloat(stat[1]) < 0) {
        ctx.fillStyle = '#ff6676'; // Màu đỏ cho profit âm
      } else {
        ctx.fillStyle = '#ffffff'; // Màu trắng cho các giá trị khác
      }
      ctx.fillText(stat[1], canvas.width / 2 + 160, y + 35 + index * 35);
    });
  }

  drawInvestmentDetails(ctx, canvas.width / 2 - 180, 270);

  // ... existing code ...
  async function drawReferralBox(x, y, referralCode) {
    const boxWidth = 360;
    const boxHeight = 100;
    // Tính toán vị trí x để căn giữa box
    const centerX = (canvas.width - boxWidth) / 2;

    // Vẽ background box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.roundRect(centerX, y, boxWidth, boxHeight, 4);
    ctx.fill();

    // Vẽ QR code
    const qrSize = 72;
    const qrX = centerX + 10;
    const qrY = y + 14; // Căn giữa theo chiều dọc trong box

    // Vẽ khung cho QR
    ctx.strokeStyle = '#666';
    ctx.strokeRect(qrX, qrY, qrSize, qrSize);

    // Vẽ QR code vào trong khung
    const qrCode = await generateQR(referralCode);
    const qrCodeImage = await loadImage(qrCode);
    ctx.drawImage(qrCodeImage, qrX, qrY, qrSize, qrSize);

    // Vẽ text content
    const textX = qrX + qrSize + 10;

    ctx.fillStyle = '#999999';
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('REFERRAL CODE', textX, y + 30);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    const referralCodeTextWidth = ctx.measureText(referralCode).width;
    ctx.fillText(referralCode, textX, y + 50);

    ctx.fillStyle = '#999999';
    ctx.font = '12px Arial';
    ctx.fillText('Refer other and earn up to 40%', textX, y + 70);

    // draw logo
    const logoImage = await loadImage('./logo.png');
    const logoX = qrX + qrSize + 10 + referralCodeTextWidth + 10;
    const logoY = y + 25;
    ctx.drawImage(logoImage, logoX, logoY, 40, 40);
  }

  await drawReferralBox(0, 400, referralCode);

  // Draw timestamp
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(
    `Time Stamp: ${new Date()
      .toISOString()
      .replace('T', ' ')
      .slice(0, 16)} (UTC)`,
    canvas.width / 2,
    canvas.height - 20
  );

  return canvas.toBuffer('image/png');
};

// Endpoint để tạo ảnh
app.post('/generate-image', async (req, res) => {
  const isPositivePnl = Math.random() > 0.5;
  const buffer = await customImage({
    symbol: '$CHILLFTH',
    pnlPercentage: isPositivePnl ? Math.random() * 10 : -Math.random() * 10,
    currentPnL: isPositivePnl
      ? Number(Math.random() * 10).toFixed(5)
      : -Number(Math.random() * 10).toFixed(5),
    currency: 'SUI',
    totalInvested: isPositivePnl ? 0.00458 : -0.00458,
    totalSold: 0,
    totalProfit: isPositivePnl ? 0.0001936 : -0.0001936,
    referralCode: 'https://raidenx.io/@ref1262915258',
  });
  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': buffer.length,
  });
  res.end(buffer);
  // await sendImage(buffer);
});

app.post('/performance-test', async (req, res) => {
  console.log('Performance test started');
  const count = 1000; // Số lượng ảnh cần tạo
  const startTime = Date.now();
  const startUsage = process.cpuUsage();
  const startMemory = process.memoryUsage();

  try {
    const promises = Array(count)
      .fill()
      .map(() => generateImage());
    const results = await Promise.all(promises);

    const endTime = Date.now();
    const endUsage = process.cpuUsage(startUsage);
    const endMemory = process.memoryUsage();

    const totalTime = endTime - startTime;
    const averageTime = totalTime / count;

    // Tính CPU và Memory usage
    const cpuUsage = {
      user: endUsage.user / 1000000, // Convert to milliseconds
      system: endUsage.system / 1000000,
    };

    const memoryUsage = {
      heapUsed: (endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024, // Convert to MB
      rss: (endMemory.rss - startMemory.rss) / 1024 / 1024,
    };

    await sendImage(results[results.length - 1]);
    res.json({
      totalImages: count,
      totalTimeMs: totalTime,
      averageTimeMs: averageTime,
      totalTimeSeconds: (totalTime / 1000).toFixed(2),
      cpuUsage: cpuUsage,
      memoryUsage: memoryUsage,
    });
    console.log('Performance test completed');
    console.log('Total time:', totalTime, 'ms');
    console.log('Average time per image:', averageTime, 'ms');
    console.log('CPU usage:', cpuUsage);
    console.log('Memory usage:', memoryUsage);
  } catch (error) {
    console.error('Error in performance test:', error);
    res.status(500).json({ error: 'Performance test failed' });
  }
});

// Trang HTML đn giản để test
app.get('/', (req, res) => {
  res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                #imageContainer { margin: 20px; }
                #generateButton, #performanceButton {
                    margin: 20px;
                    padding: 10px 20px;
                    background-color: #ff4d4d;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <button id="generateButton">Generate Image</button>
            <div id="imageContainer">
                <img id="generatedImage" style="display: none;">
            </div>
            <button id="performanceButton">Performance Test</button>
            <div id="results"></div>
            <script>
                document.getElementById('generateButton').addEventListener('click', async () => {
                    try {
                        const response = await fetch('/generate-image', {
                            method: 'POST'
                        });
                        const blob = await response.blob();
                        const imageUrl = URL.createObjectURL(blob);
                        const img = document.getElementById('generatedImage');
                        img.src = imageUrl;
                        img.style.display = 'block';
                    } catch (error) {
                        console.error('Error:', error);
                        alert('Failed to generate image');
                    }
                });
                document.getElementById('performanceButton').addEventListener('click', async () => {
                    try {
                        const resultsDiv = document.getElementById('results');
                        resultsDiv.textContent = 'Testing... Please wait...';
                        
                        const response = await fetch('/performance-test', {
                            method: 'POST'
                        });
                        const data = await response.json();
                        const totalTimeSeconds = data.totalTimeSeconds;
                        const averageTimeMs = data.averageTimeMs;
                        resultsDiv.textContent = 'Total images: ' + data.totalImages + ' Total time: ' + totalTimeSeconds + ' seconds ' + 'Average time: ' + averageTimeMs + 'ms';
                    } catch (error) {
                        console.error('Error:', error);
                        alert('Performance test failed');
                    }
                });
            </script>
        </body>
        </html>
    `);
});

const generateQR = async (referralCode) => {
  const options = {
    data: referralCode,
    image: './icon-logo.png',
    dotsOptions: {
      color: '#000000',
      type: 'rounded',
      roundSize: true,
    },
    backgroundOptions: {
      round: 0.2,
      color: '#FFFFFF',
    },
    width: 160,
    height: 160,
    type: 'png',
    shape: 'square',
    imageOptions: {
      hideBackgroundDots: true,
      crossOrigin: 'anonymous',
      margin: 0,
      imageSize: 0.5,
      saveAsBlob: true,
    },
    cornersSquareOptions: {
      color: '#222222',
      type: 'extra-rounded',
      gradient: {
        type: 'linear',
        rotation: 180,
        colorStops: [
          { offset: 0, color: '#000000' },
          { offset: 1, color: '#000000' },
        ],
      },
    },
    cornersDotOptions: {
      color: '#222222',
      type: 'dot',
      gradient: {
        type: 'linear',
        rotation: 180,
        colorStops: [
          { offset: 0, color: '#000000' },
          { offset: 1, color: '#000000' },
        ],
      },
    },
  };

  const qrCodeImage = new QRCodeStyling({
    jsdom: JSDOM,
    nodeCanvas: nodeCanvas,
    ...options,
  });

  try {
    return qrCodeImage.getRawData('png');
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
};

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
