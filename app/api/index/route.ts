import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
   // This route proxies the index data request
   // https://stock.naver.com/api/polling/domestic/index?itemCodes=KOSPI%2CKOSDAQ%2CKPI200

   // We could make itemCodes dynamic if needed, but the user requested this specific set
   const itemCodes = request.nextUrl.searchParams.get('itemCodes') || 'KOSPI,KOSDAQ,KPI200';

   try {
      const res = await fetch(`https://stock.naver.com/api/polling/domestic/index?itemCodes=${itemCodes}`, {
         headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
         }
      });
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      return NextResponse.json(data);
   } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
   }
}
