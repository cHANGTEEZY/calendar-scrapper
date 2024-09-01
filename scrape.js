const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const month = "mangsir"
    await page.goto(`https://nepalicalendar.rat32.com/2081/${month}`, { waitUntil: 'networkidle2' });


    const data = await page.evaluate(() => {
        // Fetch the month title and subtitle
        const monthTitleElement = document.querySelector('.monthname');
        const entarikYrElement = document.querySelector('.monthsubtitle');

        const monthTitle = monthTitleElement ? monthTitleElement.innerText.trim() : '';
        const entarikYr = entarikYrElement ? entarikYrElement.innerText.trim() : '';

        const days = [];

        // Loop through each cell to extract day data
        document.querySelectorAll('.cells').forEach(cell => {
            const dashiElement = cell.querySelector('#dashi');
            const ndayElement = cell.querySelector('#nday');
            const edayElement = cell.querySelector('#eday');
            const festElement = cell.querySelector('#fest');

            const dashi = dashiElement ? dashiElement.innerText : '';
            const eday = edayElement ? edayElement.innerText : '';
            const fest = festElement ? festElement.innerText : '';

            const fontElement = ndayElement ? ndayElement.querySelector('font') : null;
            const isHoliday = fontElement ? fontElement.getAttribute('color') === 'red' : false;

            days.push({
                dashi,
                nday: fontElement ? fontElement.innerText : '',
                eday,
                fest,
                holiday: isHoliday
            });
        });

        return [{
            monthTitle,
            entarikYr,
            days
        }];
    });

    // Save data to JSON file
    fs.writeFileSync(`${month}.json`, JSON.stringify(data, null, 2));

    await browser.close();
})();
