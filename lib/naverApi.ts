
export interface StockData {
   basic: any;
   hoga: any;
   tick: any;
   trend: any;
   trader: any;
   nxt: any;
   realtime: any;
   index: any;
}

const HEADERS = {
   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

async function fetchJson(url: string) {
   try {
      const res = await fetch(url, { headers: HEADERS, next: { revalidate: 0 } }); // No cache for realtime data
      if (!res.ok) return null;
      return await res.json();
   } catch (e) {
      console.error(`Failed to fetch ${url}`, e);
      return null;
   }
}

export async function fetchStockData(code: string): Promise<StockData> {
   const [basic, hoga, tick, trend, trader, nxt, realtime, index] = await Promise.all([
      fetchJson(`https://stock.naver.com/api/polling/domestic/stock?itemCodes=${code}`),
      fetchJson(`https://stock.naver.com/api/domestic/detail/${code}/hoga`),
      fetchJson(`https://stock.naver.com/api/domestic/detail/${code}/siseTick?startIdx=0&pageSize=20`),
      fetchJson(`https://stock.naver.com/api/domestic/detail/${code}/trend?tradeType=KRX&startIdx=0&pageSize=50`),
      fetchJson(`https://stock.naver.com/api/domestic/detail/${code}/traderInfo`),
      fetchJson(`https://stock.naver.com/api/polling/domestic/NXT/stock?itemCodes=${code}`),
      fetchJson(`https://polling.finance.naver.com/api/realtime/domestic/stock/${code}`),
      fetchJson(`https://stock.naver.com/api/polling/domestic/index?itemCodes=KOSPI%2CKOSDAQ%2CKPI200`)
   ]);

   return { basic, hoga, tick, trend, trader, nxt, realtime, index };
}
