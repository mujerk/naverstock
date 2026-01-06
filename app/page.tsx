'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import StockHeader from '@/components/StockHeader';
import JsonViewer from '@/components/JsonViewer';

interface StockData {
   basic: any;
   hoga: any;
   tick: any;
   trend: any;
   trader: any;
}

export default function Home() {
   const [selectedStock, setSelectedStock] = useState({ name: '삼성전자', code: '005930' });
   const [data, setData] = useState<StockData>({
      basic: null,
      hoga: null,
      tick: null,
      trend: null,
      trader: null,
   });
   const [loading, setLoading] = useState(false);
   const [timestamp, setTimestamp] = useState<string>('');

   const fetchData = useCallback(async (code: string) => {
      setLoading(true);
      try {
         const [basicRes, hogaRes, tickRes, trendRes, traderRes] = await Promise.all([
            fetch(`/api/stock?code=${code}`),
            fetch(`/api/hoga?code=${code}`),
            fetch(`/api/tick?code=${code}`),
            fetch(`/api/trend?code=${code}`),
            fetch(`/api/trader?code=${code}`)
         ]);

         const [basic, hoga, tick, trend, trader] = await Promise.all([
            basicRes.json(),
            hogaRes.json(),
            tickRes.json(),
            trendRes.json(),
            traderRes.json()
         ]);

         setData({ basic, hoga, tick, trend, trader });
         setTimestamp(new Date().toLocaleTimeString());
      } catch (error) {
         console.error("Failed to fetch data", error);
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      fetchData(selectedStock.code);

      // Optional: Auto-refresh every 10 seconds
      const interval = setInterval(() => {
         fetchData(selectedStock.code);
      }, 10000);

      return () => clearInterval(interval);
   }, [selectedStock, fetchData]);

   return (
      <main className="flex flex-col md:flex-row h-screen bg-background text-foreground overflow-hidden">
         <div className="w-full md:w-auto flex-shrink-0">
            <Sidebar
               onSelectStock={setSelectedStock}
               selectedStock={selectedStock}
            />
         </div>

         <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-10">

               <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 border-b border-white/5 pb-6">
                     <StockHeader
                        name={selectedStock.name}
                        code={selectedStock.code}
                     />
                     <div className="flex flex-col items-end gap-2">
                        <button
                           onClick={() => {
                              const allData = {
                                 stockInfo: data.basic,
                                 hoga: data.hoga,
                                 tick: data.tick,
                                 trend: data.trend,
                                 trader: data.trader,
                                 retrievedAt: new Date().toISOString()
                              };
                              navigator.clipboard.writeText(JSON.stringify(allData, null, 2));
                              alert('모든 JSON 데이터가 복사되었습니다.');
                           }}
                           className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                           Copy All JSON
                        </button>
                        <div className="text-right text-xs text-muted-foreground font-mono">
                           Last Update: {timestamp}
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 pb-20">
                     {/* 1. Basic Info */}
                     <div>
                        <JsonViewer
                           title="주식 기본 정보 (poling/stock)"
                           data={data.basic}
                           isLoading={loading && !data.basic}
                        />
                     </div>

                     {/* 2. Hoga */}
                     <div>
                        <JsonViewer
                           title="호가 (Hoga)"
                           data={data.hoga}
                           isLoading={loading && !data.hoga}
                        />
                     </div>

                     {/* 3. Tick */}
                     <div>
                        <JsonViewer
                           title="실시간 체결 (Tick)"
                           data={data.tick}
                           isLoading={loading && !data.tick}
                        />
                     </div>

                     {/* 4. Trend */}
                     <div>
                        <JsonViewer
                           title="트렌드/차트 데이터 (Trend)"
                           data={data.trend}
                           isLoading={loading && !data.trend}
                        />
                     </div>

                     {/* 5. Trader Info */}
                     <div>
                        <JsonViewer
                           title="투자자별 매매동향 (Trader Info)"
                           data={data.trader}
                           isLoading={loading && !data.trader}
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </main>
   );
}
