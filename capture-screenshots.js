const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/local/bin/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  const indexPath = 'file://' + path.resolve(__dirname, 'index.html');
  
  // Desktop hero + Aegis
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(indexPath, { waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.screenshot({ 
    path: '.github/pr-screenshots/desktop-b1-hero.png',
    fullPage: false
  });
  
  // Scroll to Aegis section
  await page.evaluate(() => {
    document.querySelector('#aegis').scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(resolve => setTimeout(resolve, 500));
  await page.screenshot({ 
    path: '.github/pr-screenshots/desktop-b1-aegis.png',
    fullPage: false
  });
  
  // Mobile
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(indexPath, { waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.screenshot({ 
    path: '.github/pr-screenshots/mobile-b1-hero.png',
    fullPage: false
  });
  
  await browser.close();
  console.log('Screenshots captured successfully');
})();
