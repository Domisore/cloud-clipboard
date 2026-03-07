const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Set a high resolution, deviceScaleFactor: 1 to enforce exactly 1280x800 output
    await page.setViewport({ width: 1400, height: 4000, deviceScaleFactor: 1 });

    console.log('Navigating to http://localhost:3000/extension-screenshots...');
    await page.goto('http://localhost:3000/extension-screenshots', { waitUntil: 'networkidle0' });

    // Give animations a moment to settle
    await new Promise(r => setTimeout(r, 2000));

    console.log('Finding screenshot frames...');
    const frames = await page.$$('.w-\\[1280px\\]');

    if (frames.length !== 3) {
        console.error(`Expected 3 frames, but found ${frames.length}. Exiting.`);
        await browser.close();
        process.exit(1);
    }

    const outputDir = path.join(__dirname, '..', 'public', 'chrome-extension');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('Capturing Frame 1...');
    await frames[0].screenshot({ path: path.join(outputDir, 'screenshot-1.jpg'), type: 'jpeg', quality: 100 });

    console.log('Capturing Frame 2...');
    await frames[1].screenshot({ path: path.join(outputDir, 'screenshot-2.jpg'), type: 'jpeg', quality: 100 });

    console.log('Capturing Frame 3...');
    await frames[2].screenshot({ path: path.join(outputDir, 'screenshot-3.jpg'), type: 'jpeg', quality: 100 });

    console.log('Done! Saved to public/chrome-extension/');
    await browser.close();
})();
