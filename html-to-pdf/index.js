const os = require('os');
const puppeteer = require('puppeteer');
const fs = require('fs');
const { sendErrorResponse } = require('../common/utils');

module.exports = async (ctx, req) => {
  const context = ctx;
  const reqBody = req.body ? JSON.parse(JSON.stringify(req.body)) : {};
  const { html, url } = reqBody;

  if (!html && !url) {
    return sendErrorResponse(context, 400, 'Please send `html` or `url` string in request body.');
  }

  let tempDir = os.tmpdir();
  let tempFile = `${tempDir}/temp_${Date.now()}.pdf`;

  try {
    await (async () => {
      const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();
      // await page.setViewport({ width: 1240, height: 1754 });
      // await page.goto(`file:${Path.join(__dirname, htmlPath)}`);
      if (url) await page.goto(url, { waitUntil: 'networkidle0' });
      else if (html) await page.setContent(html);
      
      await page.pdf({
        path: tempFile,
        // preferCSSPageSize: true,
        // printBackground: true,
        displayHeaderFooter: true,
        footerTemplate: '<span></span>',
        printBackground: true,
        format: 'A4',
        // width: '1240px',
        // height: '1754px',
        // width: '1060px',
        // height: '1500px',
      });
      await browser.close();
      context.res = {
        status: 200,
        headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=download.pdf' },
        isRaw: true,
        body: fs.readFileSync(tempFile)
      };
      context.done();
    })();
  } catch (e) {
    const error = { ...e };
    context.log(e);
    return sendErrorResponse(context, error.statusCode || 500, e.message);
  }
};
