'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import StockHeader from '@/components/StockHeader';
import JsonViewer from '@/components/JsonViewer';
import { INITIAL_STOCKS } from '@/lib/stocks';

import { StockData } from '@/lib/naverApi';

interface StockDashboardProps {
   code: string;
   initialName?: string;
   initialData?: StockData;
}

export default function StockDashboard({ code, initialName, initialData }: StockDashboardProps) {
   // Try to find the name from our static list first
   const staticInfo = useMemo(() => INITIAL_STOCKS.find(s => s.code === code), [code]);
   const defaultName = staticInfo ? staticInfo.name : code;

   const [stockName, setStockName] = useState(initialName || defaultName);
   const [data, setData] = useState<StockData>(initialData || {
      basic: null,
      hoga: null,
      tick: null,
      trend: null,
      trader: null,
      nxt: null,
      realtime: null,
      index: null,
   });
   const [loading, setLoading] = useState(false);
   const [timestamp, setTimestamp] = useState<string>('');

   const fetchData = useCallback(async (stockCode: string) => {
      setLoading(true);
      try {
         const [basicRes, hogaRes, tickRes, trendRes, traderRes, nxtRes, realtimeRes, indexRes] = await Promise.all([
            fetch(`/api/stock?code=${stockCode}`),
            fetch(`/api/hoga?code=${stockCode}`),
            fetch(`/api/tick?code=${stockCode}`),
            fetch(`/api/trend?code=${stockCode}`),
            fetch(`/api/trader?code=${stockCode}`),
            fetch(`/api/nxt?code=${stockCode}`),
            fetch(`/api/realtime?code=${stockCode}`),
            fetch(`/api/index?itemCodes=KOSPI,KOSDAQ,KPI200`)
         ]);

         const [basic, hoga, tick, trend, trader, nxt, realtime, index] = await Promise.all([
            basicRes.json(),
            hogaRes.json(),
            tickRes.json(),
            trendRes.json(),
            traderRes.json(),
            nxtRes.json(),
            realtimeRes.json(),
            indexRes.json()
         ]);

         setData({ basic, hoga, tick, trend, trader, nxt, realtime, index });

         // Try to extract name from basic info if available
         if (basic && basic.stockName) {
            setStockName(basic.stockName);
         } else if (basic && basic.itemCode) {
            // Some APIs return it differently, check naver response structure if needed
            // For now assume basic info might have it or we trust the API
         }

         setTimestamp(new Date().toLocaleTimeString());
      } catch (error) {
         console.error("Failed to fetch data", error);
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      fetchData(code);

      // Automatic refresh every 10 seconds
      const interval = setInterval(() => {
         fetchData(code);
      }, 10000);

      return () => clearInterval(interval);
   }, [code, fetchData]);

   return (
      <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0 bg-background text-foreground">
         {/* Background decoration */}
         <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

         <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-10">

            <div className="max-w-7xl mx-auto">
               {/* Market Indices */}
               {data.index && data.index.datas && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                     {['KOSPI', 'KOSDAQ'].map(idxCode => {
                        const idxData = data.index.datas.find((d: any) => d.itemCode === idxCode);
                        if (!idxData) return null;

                        const price = Number(idxData.closePrice.replace(/,/g, ''));
                        const change = Number(idxData.compareToPreviousClosePrice.replace(/,/g, ''));
                        const rate = Number(idxData.fluctuationsRatio);
                        const isUp = change > 0;
                        const isDown = change < 0;
                        const colorClass = isUp ? 'text-red-500' : isDown ? 'text-blue-500' : 'text-gray-400';

                        return (
                           <div key={idxCode} className="bg-black/40 border border-white/10 rounded-lg p-4 backdrop-blur-sm">
                              <div className="flex justify-between items-start mb-2">
                                 <span className="text-sm font-bold text-muted-foreground">{idxCode}</span>
                                 <span className={`text-xs px-1.5 py-0.5 rounded bg-white/5 ${colorClass}`}>
                                    {rate > 0 ? '+' : ''}{rate}%
                                 </span>
                              </div>
                              <div className="flex items-baseline gap-2">
                                 <span className={`text-2xl font-bold font-mono ${colorClass}`}>
                                    {idxData.closePrice}
                                 </span>
                                 <span className={`text-xs ${colorClass}`}>
                                    {isUp ? '▲' : isDown ? '▼' : ''} {Math.abs(change).toLocaleString()}
                                 </span>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               )}

               <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 border-b border-white/5 pb-6">
                  <StockHeader
                     name={stockName}
                     code={code}
                  />
                  <div className="flex flex-col items-end gap-2">
                     <button
                        onClick={() => {
                           const allData = [
                              { title: '1. NXT 시간외 (NXT)', data: data.nxt },
                              { title: '2. 주식 기본 정보 (poling/stock)', data: data.basic },
                              { title: '3. 호가 (Hoga)', data: data.hoga },
                              { title: '4. 실시간 체결 (Tick)', data: data.tick },
                              { title: '5. 트렌드/차트 데이터 (Trend)', data: data.trend },
                              { title: '6. 투자자별 매매동향 (Trader Info)', data: data.trader },
                              { title: '7. 실시간 정보 (Realtime)', data: data.realtime },
                              { title: '8. 지수 정보 (KOSPI/KOSDAQ)', data: data.index }
                           ].map(item => `[${item.title}]\n${JSON.stringify(item.data, null, 2)}`).join('\n\n');

                           navigator.clipboard.writeText(allData);
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

               {/* Parsed Basic Info Box */}
               <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8 text-black">
                  {data.basic ? (
                     (() => {
                        const parseNumber = (val: any) => {
                           if (typeof val === 'number') return val;
                           if (typeof val === 'string') {
                              const parsed = Number(val.replace(/,/g, ''));
                              return isNaN(parsed) ? 0 : parsed;
                           }
                           return 0;
                        };

                        // Check if NXT data exists and is valid
                        const hasNxt = data.nxt && data.nxt.datas && data.nxt.datas.length > 0;
                        const nxtData = hasNxt ? data.nxt.datas[0] : null;
                        const basicData = data.basic && data.basic.datas ? data.basic.datas[0] : (data.basic || {});

                        // Use NXT data if available, otherwise fallback to basic
                        const info = hasNxt ? nxtData : basicData;

                        const closePrice = parseNumber(info.closePrice);
                        const compareToPreviousClosePrice = parseNumber(info.compareToPreviousClosePrice);
                        const fluctuationsRatio = parseNumber(info.fluctuationsRatio);
                        const volume = parseNumber(info.accumulatedTradingVolume);
                        const value = parseNumber(info.accumulatedTradingValue);

                        // Check if value is valid to display
                        const showValue = !isNaN(value) && value > 0;

                        const openPrice = parseNumber(info.openPrice);
                        const highPrice = parseNumber(info.highPrice);
                        const lowPrice = parseNumber(info.lowPrice);

                        return (
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                              {/* Current Price */}
                              <div className="col-span-2 md:col-span-1">
                                 <div className="text-sm text-gray-500 mb-1">현재가 {hasNxt ? '(NXT)' : ''}</div>
                                 <div className={`text-3xl font-bold ${fluctuationsRatio > 0 ? 'text-red-600' :
                                    fluctuationsRatio < 0 ? 'text-blue-600' : 'text-black'
                                    }`}>
                                    {closePrice.toLocaleString()}
                                    <span className="text-sm font-normal ml-2 opacity-80 text-black">KRW</span>
                                 </div>
                              </div>

                              {/* Change Information */}
                              <div className="col-span-2 md:col-span-1 flex flex-col justify-center">
                                 <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm text-gray-500">전일대비</span>
                                    <span className={`text-lg font-semibold ${compareToPreviousClosePrice > 0 ? 'text-red-600' :
                                       compareToPreviousClosePrice < 0 ? 'text-blue-600' : 'text-black'
                                       }`}>
                                       {compareToPreviousClosePrice > 0 ? '▲' : compareToPreviousClosePrice < 0 ? '▼' : '-'}
                                       {Math.abs(compareToPreviousClosePrice).toLocaleString()}
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">등락률</span>
                                    <span className={`text-lg font-semibold ${fluctuationsRatio > 0 ? 'text-red-600' :
                                       fluctuationsRatio < 0 ? 'text-blue-600' : 'text-black'
                                       }`}>
                                       {fluctuationsRatio > 0 ? '+' : ''}{fluctuationsRatio}%
                                    </span>
                                 </div>
                              </div>

                              {/* Volume */}
                              <div className="col-span-1">
                                 <div className="text-sm text-gray-500 mb-1">거래량</div>
                                 <div className="text-lg font-mono text-black">
                                    {volume.toLocaleString()}
                                 </div>
                                 <div className="text-xs text-gray-400 mt-1">주</div>
                              </div>

                              {/* Trading Value (Conditional) */}
                              {showValue ? (
                                 <div className="col-span-1">
                                    <div className="text-sm text-gray-500 mb-1">거래대금</div>
                                    <div className="text-lg font-mono text-black">
                                       {Math.round(value / 1000000).toLocaleString()}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">백만</div>
                                 </div>
                              ) : (
                                 <div className="col-span-1 hidden md:block"></div>
                              )}

                              {/* OHLC */}
                              <div className="col-span-2 md:col-span-4 grid grid-cols-3 gap-4 border-t border-gray-200 pt-4 mt-2">
                                 <div>
                                    <div className="text-xs text-gray-500 mb-1">시가</div>
                                    <div className={`text-base font-medium ${openPrice > closePrice ? 'text-blue-600' : 'text-red-600'
                                       }`}>
                                       {openPrice.toLocaleString()}
                                    </div>
                                 </div>
                                 <div>
                                    <div className="text-xs text-gray-500 mb-1">고가</div>
                                    <div className="text-base font-medium text-red-600">
                                       {highPrice.toLocaleString()}
                                    </div>
                                 </div>
                                 <div>
                                    <div className="text-xs text-gray-500 mb-1">저가</div>
                                    <div className="text-base font-medium text-blue-600">
                                       {lowPrice.toLocaleString()}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        );
                     })()
                  ) : (
                     <div className="h-32 flex items-center justify-center text-gray-500">
                        {loading ? '데이터 로딩 중...' : '데이터가 없습니다.'}
                     </div>
                  )}
               </div>

               {/* Requested SSR Data Preview for View Source - Hidden from view but present in source */}
               <div className="mb-8 hidden">
                  <h3>시간외 거래정보(NXT)</h3>
                  <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60 text-xs text-black">
                     {JSON.stringify(data.nxt?.datas?.[0] || data.nxt, null, 2)}
                  </pre>
               </div>


               <div className="mt-8 border-t border-white/10 pt-6 pb-20">
                  <h3 className="text-sm font-semibold mb-2 text-primary flex items-center gap-2">
                     All JSON Data Preview
                  </h3>
                  <div className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-xs font-mono text-muted-foreground overflow-x-auto">
                     <pre className="whitespace-pre-wrap break-all">
                        {[
                           { title: '1. NXT 시간외 (NXT)', data: data.nxt },
                           { title: '2. 주식 기본 정보 (poling/stock)', data: data.basic },
                           { title: '3. 호가 (Hoga)', data: data.hoga },
                           { title: '4. 실시간 체결 (Tick)', data: data.tick },
                           { title: '5. 트렌드/차트 데이터 (Trend)', data: data.trend },
                           { title: '6. 투자자별 매매동향 (Trader Info)', data: data.trader },
                           { title: '7. 실시간 정보 (Realtime)', data: data.realtime },
                           { title: '8. 지수 정보 (KOSPI/KOSDAQ)', data: data.index }
                        ].map(item => `[${item.title}]\n${JSON.stringify(item.data, null, 2)}`).join('\n\n')}
                     </pre>
                  </div>
               </div>

            </div>
         </div>
      </div >
   );
}
