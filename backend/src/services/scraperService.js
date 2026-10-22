const axios = require('axios');
const cheerio = require('cheerio');

// In-Memory Fast Cache (0ms latency for POS terminals)
let cachedBullionRates = {
  gold24k: 14607.00, // ₹ / gram (Live Market Benchmark)
  gold22k: 13389.00, // 91.67%
  gold20k: 12172.00, // 83.33%
  gold18k: 10955.00, // 75.00%
  gold14k: 8520.00,  // 58.33%
  silver: 229.90,    // ₹ / gram (alias for frontend compatibility)
  silver999: 229.90, // ₹ / gram
  silver925: 212.66, // 92.5%
  mcxGold: 146070.00,
  mcxSilver: 229900.00,
  source: 'GOODRETURNS_LIVE_BENCHMARK',
  lastUpdated: new Date().toISOString(),
  changeDirection: 'STABLE' // 'UP', 'DOWN', 'STABLE'
};

/**
 * Mathematical Purity Derivation Engine
 */
function deriveAllPurities(base24kPerGram, silverPerGram, sourceName = 'LIVE_SCRAPER') {
  const g24 = parseFloat(base24kPerGram) || 14607.00;
  const s999 = parseFloat(silverPerGram) || 229.90;

  const previous24k = cachedBullionRates.gold24k;
  let changeDirection = 'STABLE';
  if (g24 > previous24k) changeDirection = 'UP';
  else if (g24 < previous24k) changeDirection = 'DOWN';

  const g22 = +(g24 * 0.9167).toFixed(2);
  const g20 = +(g24 * 0.8333).toFixed(2);
  const g18 = +(g24 * 0.7500).toFixed(2);
  const g14 = +(g24 * 0.5833).toFixed(2);
  const silverVal = +s999.toFixed(2);
  const s925 = +(s999 * 0.925).toFixed(2);

  return {
    gold24k: +g24.toFixed(2),
    gold22k: g22,
    gold20k: g20,
    gold18k: g18,
    gold14k: g14,
    silver: silverVal,
    silver999: silverVal,
    silver925: s925,
    mcxGold: +(g24 * 10).toFixed(2),
    mcxSilver: +(s999 * 1000).toFixed(2),
    source: sourceName,
    lastUpdated: new Date().toISOString(),
    changeDirection
  };
}

/**
 * Scrape Live Bullion Rates from Indian Benchmarks
 * Primary: GoodReturns (India Live Benchmarks)
 * Secondary: BankBazaar (Commodities Daily Index)
 */
async function scrapeLiveBullionRates() {
  const requestHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9'
  };

  // Attempt 1: GoodReturns
  try {
    const goldResp = await axios.get('https://www.goodreturns.in/gold-rates/', {
      headers: requestHeaders,
      timeout: 8000
    });
    const $g = cheerio.load(goldResp.data);
    let scraped24k = null;
    let scraped22k = null;
    let scraped18k = null;

    $g('table').first().find('tr').each((_, row) => {
      const cells = $g(row).find('td').map((__, c) => $g(c).text().trim()).get();
      // Table 0: Gram | 24K | 22K | 18K where Gram === '1'
      if (cells.length >= 4 && cells[0] === '1') {
        const parseVal = (str) => {
          const m = str.match(/₹\s*([0-9,.]+)/);
          return m ? parseFloat(m[1].replace(/,/g, '')) : null;
        };
        scraped24k = parseVal(cells[1]);
        scraped22k = parseVal(cells[2]);
        scraped18k = parseVal(cells[3]);
      }
    });

    let scrapedSilver = null;
    try {
      const silverResp = await axios.get('https://www.goodreturns.in/silver-rates/', {
        headers: requestHeaders,
        timeout: 8000
      });
      const $s = cheerio.load(silverResp.data);
      $s('table').first().find('tr').each((_, row) => {
        const cells = $s(row).find('td').map((__, c) => $s(c).text().trim()).get();
        if (cells.length >= 2 && cells[0] === '1') {
          const m = cells[1].match(/₹\s*([0-9,.]+)/);
          if (m) scrapedSilver = parseFloat(m[1].replace(/,/g, ''));
        }
      });
    } catch (silverErr) {
      console.warn('[SCRAPER] Goodreturns silver fetch timed out, falling back to default/cached silver.');
    }

    if (scraped24k && scraped24k > 1000) {
      const finalSilver = scrapedSilver || cachedBullionRates.silver || 229.90;
      cachedBullionRates = deriveAllPurities(scraped24k, finalSilver, 'GOODRETURNS_LIVE_SCRAPER');
      if (scraped22k) cachedBullionRates.gold22k = scraped22k;
      if (scraped18k) cachedBullionRates.gold18k = scraped18k;

      console.log(`[SCRAPER] Successfully updated from GoodReturns: 24K: ₹${cachedBullionRates.gold24k}/g | 22K: ₹${cachedBullionRates.gold22k}/g | Silver: ₹${cachedBullionRates.silver}/g`);
      return cachedBullionRates;
    }
  } catch (primaryErr) {
    console.warn('[SCRAPER] Primary GoodReturns scraper failed or timed out:', primaryErr.message);
  }

  // Attempt 2: BankBazaar Fallback
  try {
    const bbResp = await axios.get('https://www.bankbazaar.com/gold-rate-india.html', {
      headers: { 'User-Agent': requestHeaders['User-Agent'] },
      timeout: 8000
    });
    const $bb = cheerio.load(bbResp.data);
    let bb24k = null;

    $bb('table').each((_, tbl) => {
      const header = $bb(tbl).find('tr').first().text();
      if (header.includes('18K Price') && header.includes('24K Price')) {
        const firstDataRow = $bb(tbl).find('tr').eq(1).find('td').map((__, c) => $bb(c).text().trim()).get();
        if (firstDataRow.length >= 4) {
          const m = firstDataRow[3].match(/Rs\.\s*([0-9,]+)/i) || firstDataRow[3].match(/([0-9,]+)/);
          if (m) bb24k = parseFloat(m[1].replace(/,/g, ''));
        }
      }
    });

    if (bb24k && bb24k > 1000) {
      cachedBullionRates = deriveAllPurities(bb24k, cachedBullionRates.silver || 229.90, 'BANKBAZAAR_FALLBACK_SCRAPER');
      console.log(`[SCRAPER] Successfully updated from BankBazaar fallback: 24K: ₹${cachedBullionRates.gold24k}/g`);
      return cachedBullionRates;
    }
  } catch (secondaryErr) {
    console.warn('[SCRAPER] Secondary BankBazaar scraper failed:', secondaryErr.message);
  }

  console.warn('[SCRAPER] Scrapers unreachable, maintaining cached bullion rates.');
  return cachedBullionRates;
}

/**
 * Get current in-memory cached rates instantly
 */
function getCachedRates() {
  return cachedBullionRates;
}

/**
 * Manual Store Rate Override by Shop Owner
 */
function setManualStoreRates(customRates) {
  cachedBullionRates = {
    ...cachedBullionRates,
    ...customRates,
    source: 'STORE_OWNER_MANUAL_OVERRIDE',
    lastUpdated: new Date().toISOString()
  };
  return cachedBullionRates;
}

module.exports = {
  scrapeLiveBullionRates,
  getCachedRates,
  setManualStoreRates,
  deriveAllPurities
};
