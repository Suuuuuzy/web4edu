// npm i puppeteer
// script to emulate admin bot
const puppeteer = require("puppeteer");

const FLAG = "flag{d0m_d0n't_pur1fy_cl0bb3r1n9_s0urc3_T.T_894ABCDF9}";
const SITE = "http://localhost:8399";
function sleep(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}
function overWriteHostname(url) {
    to_url = new URL(url);
    if (to_url.hostname.endsWith(".secjhu.club")) {
        to_url.protocol = "http";
        to_url.hostname = "localhost";
        to_url.port = "8399";
    }
    return to_url.toString();
}
const visit = async (url) => {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            pipe: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--js-flags=--jitless",
            ],
            dumpio: true
        });

        // incognito btw
        const ctx = await browser.createBrowserContext();

        let page = await ctx.newPage();
        await page.goto(SITE, { timeout: 3000, waitUntil: 'domcontentloaded' });

        await page.evaluate((flag) => {
            localStorage.setItem("flag", flag);
        }, FLAG);

        await sleep(1000);
        await page.close();

        page = await ctx.newPage();
        await page.goto(overWriteHostname(url), { timeout: 10000, waitUntil: 'domcontentloaded' });
        await sleep(3000);

        await browser.close();
        browser = null;
    } catch (err) {
        console.log(err);
    } finally {
        if (browser) await browser.close();
    }
};

// Export the visit function
module.exports = { visit };