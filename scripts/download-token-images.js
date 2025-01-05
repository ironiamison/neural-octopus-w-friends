const https = require('https');
const fs = require('fs');
const path = require('path');

const tokenImages = {
  'pepe': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/GHvFFSZ9BctWsEc5nujR1MTmmJWY7tgQz2AXE6WVFtGN/logo.png',
  'floki': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/FLoKHzwscKwM4wRC6yGsCwHYJdwTxJcgsRLqvE5RqxYq/logo.png',
  'wif': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm/logo.png',
  'meme': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/MeMeeUXpwCHE8WxGPZyguq6zWJvpvNzwQYqWyBwXVm7/logo.png',
  'bonk': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png',
  'myro': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/HhJpBhRRn4g56VsyLuT8DL5Bv31HkXqsrahTTUCZeZg4/logo.png'
};

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, '../public/tokens', filename);
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
};

async function downloadAllImages() {
  try {
    // Create tokens directory if it doesn't exist
    const tokensDir = path.join(__dirname, '../public/tokens');
    if (!fs.existsSync(tokensDir)) {
      fs.mkdirSync(tokensDir, { recursive: true });
    }

    // Download all images
    const downloads = Object.entries(tokenImages).map(([token, url]) => {
      return downloadImage(url, `${token}.png`);
    });

    await Promise.all(downloads);
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
}

downloadAllImages(); 