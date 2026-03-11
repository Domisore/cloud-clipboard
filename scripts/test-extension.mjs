import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extensionPath = path.join(__dirname, '..', 'chrome-extension');

async function runTest() {
    console.log(`Loading extension from: ${extensionPath}`);
    
    const browser = await puppeteer.launch({
        headless: "new", // Must explicitly opt-in to new headless for extensions if not opening UI, or use false
        args: [
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`,
        ],
    });

    try {
        console.log('1. Browser launched.');

        // Find the background target to get the extension ID
        const backgroundPageTarget = await browser.waitForTarget(
            t => t.type() === 'service_worker'
        );
        
        // Next extract the extension ID from the background page URL
        const extensionUrl = backgroundPageTarget.url() || '';
        const [, , extensionId] = extensionUrl.split('/');
        
        console.log(`2. Extension ID: ${extensionId}`);

        // Open the popup page directly
        const popupUrl = `chrome-extension://${extensionId}/popup.html`;
        console.log(`3. Opening popup: ${popupUrl}`);
        
        const page = await browser.newPage();
        await page.goto(popupUrl);
        
        // Wait for elements to be ready
        await page.waitForSelector('#clipText', { visible: false }); // It's in DOM but might be hidden

        console.log(`4. Bypassing extension auth UI...`);
        // Manually force the authenticated view to show up so we can interact with it
        await page.evaluate(() => {
            const authStatusDiv = document.getElementById('authStatus');
            const authenticatedView = document.getElementById('authenticatedView');
            const signedOutView = document.getElementById('signedOutView');
            
            if (authenticatedView && signedOutView && authStatusDiv) {
                authenticatedView.style.display = 'block';
                signedOutView.style.display = 'none';
                authStatusDiv.innerHTML = `<span style="color: #4ade80;">Test Mode Active</span>`;
            }
        });
        
        // Type a text clip
        const testContent = `This is an automated Puppeteer test from the Chrome Extension at ${new Date().toISOString()}`;
        console.log(`5. Typing text...`);
        await page.type('#clipText', testContent);

        
        // Add a small delay to simulate human action
        await new Promise(r => setTimeout(r, 500));
        
        console.log(`5. Clicking Save button...`);
        // Click the save button
        await page.click('#saveBtn');
        
        // Wait for the status text to change to success
        console.log(`6. Waiting for server response...`);
        
        await page.waitForSelector('.success', { timeout: 10000 });
        
        // Get the generated URL
        const linkElement = await page.$('.link-out');
        const generatedUrl = await page.evaluate(el => el.href, linkElement);
        
        console.log(`\n============================`);
        console.log(`✅ TEST SUCCESSFUL!`);
        console.log(`Extension generated link: ${generatedUrl}`);
        console.log(`============================\n`);
        
    } catch (error) {
        console.error(`\n❌ TEST FAILED!`);
        console.error(error);
        process.exitCode = 1;
    } finally {
        await browser.close();
    }
}

runTest();
