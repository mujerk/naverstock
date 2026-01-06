import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
   const code = request.nextUrl.searchParams.get('code');
   if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
   }

   try {
      // https://stock.naver.com/api/domestic/detail/005930/trend?tradeType=KRX&startIdx=0&pageSize=50
      const res = await fetch(`https://stock.naver.com/api/domestic/detail/${code}/trend?tradeType=KRX&startIdx=0&pageSize=50`, {
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
