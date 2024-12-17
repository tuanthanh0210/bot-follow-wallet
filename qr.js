const {
  QRCodeStyling,
} = require('qr-code-styling/lib/qr-code-styling.common.js');
const nodeCanvas = require('canvas');
const { JSDOM } = require('jsdom');
const fs = require('fs');

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
    imageOptions: {
      saveAsBlob: true,
      crossOrigin: 'anonymous',
      margin: 0,
    },
  });

  try {
    const blob = await qrCodeImage.getRawData('png');
    fs.writeFileSync('qr.png', blob);
    return blob;
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
};

(async () => {
  await generateQR('https://raidenx.io/@ref1262915258');
})();
