'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { INITIAL_STOCKS, Stock } from '@/lib/stocks';

// Previously passed as props, now redundant or managed internally
// interface SidebarProps {
//    onSelectStock: (stock: Stock) => void;
//    selectedStock: Stock;
// }

export default function Sidebar() {
   const params = useParams();
   const router = useRouter();
   const currentCode = params?.code as string; // Get code from URL

   const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
   const [isAdding, setIsAdding] = useState(false);
   const [newStock, setNewStock] = useState({ name: '', code: '' });
   const [isLoaded, setIsLoaded] = useState(false);

   // Load from LocalStorage on mount
   useEffect(() => {
      const savedStocks = localStorage.getItem('naver_stocks_v2');
      if (savedStocks) {
         try {
            setStocks(JSON.parse(savedStocks));
         } catch (e) {
            console.error("Failed to parse stocks", e);
         }
      }
      setIsLoaded(true);
   }, []);

   // Save to LocalStorage whenever stocks change, BUT only after initial load
   useEffect(() => {
      if (isLoaded) {
         localStorage.setItem('naver_stocks_v2', JSON.stringify(stocks));
      }
   }, [stocks, isLoaded]);

   const handleAddStock = () => {
      if (newStock.name && newStock.code) {
         setStocks([...stocks, newStock]);
         setNewStock({ name: '', code: '' });
         setIsAdding(false);
      }
   };

   const handleRemoveStock = (e: React.MouseEvent, code: string) => {
      e.preventDefault(); // Prevent link navigation if inside a link (though button is nested, safer)
      e.stopPropagation();
      setStocks(stocks.filter(s => s.code !== code));
   };

   const handleMobileSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const stock = JSON.parse(e.target.value);
      router.push(`/${stock.code}`);
   };

   // Helper to find name for current select box value
   const currentStockObj = stocks.find(s => s.code === currentCode) || stocks[0];

   return (
      <div className="w-full md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-white/10 bg-background/50 flex flex-col backdrop-blur-sm">
         <div className="p-4 border-b border-white/10 flex justify-between items-center md:block">
            <h1 className="text-xl font-bold text-primary mb-2 md:mb-2 flex items-center gap-2">
               Stock API
            </h1>

            {/* Mobile: Select Box */}
            <div className="md:hidden flex-1 ml-4">
               <select
                  value={JSON.stringify(currentStockObj)}
                  onChange={handleMobileSelect}
                  className="w-full bg-card border border-white/20 text-foreground rounded px-3 py-2 text-sm outline-none focus:border-primary"
               >
                  {stocks.map(stock => (
                     <option key={stock.code} value={JSON.stringify(stock)}>
                        {stock.name} ({stock.code})
                     </option>
                  ))}
               </select>
            </div>

            {/* Desktop: Add Button */}
            <button
               onClick={() => setIsAdding(!isAdding)}
               className="hidden md:flex w-full mt-2 items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 rounded-md text-sm transition-colors"
            >
               <Plus size={16} /> 종목 추가
            </button>
         </div>

         {isAdding && (
            <div className="hidden md:block p-3 border-b border-white/10 bg-black/20 animate-in slide-in-from-top-2">
               <input
                  type="text"
                  placeholder="종목명"
                  className="w-full bg-background border border-white/20 rounded px-2 py-1 mb-2 text-sm focus:border-primary outline-none"
                  value={newStock.name}
                  onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
               />
               <input
                  type="text"
                  placeholder="코드 (예: 005930)"
                  className="w-full bg-background border border-white/20 rounded px-2 py-1 mb-2 text-sm focus:border-primary outline-none"
                  value={newStock.code}
                  onChange={(e) => setNewStock({ ...newStock, code: e.target.value })}
               />
               <button
                  onClick={handleAddStock}
                  className="w-full bg-primary text-primary-foreground text-xs py-1 rounded hover:bg-primary/90"
               >
                  확인
               </button>
            </div>
         )}

         {/* Desktop: List View */}
         <div className="hidden md:block flex-1 overflow-y-auto p-2">
            {stocks.map((stock) => (
               <Link
                  key={stock.code}
                  href={`/${stock.code}`}
                  className={`
              w-full text-left px-4 py-3 rounded-lg mb-1 flex justify-between items-center group cursor-pointer transition-all duration-200
              ${currentCode === stock.code
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground hover:translate-x-1'
                     }
            `}
               >
                  <div>
                     <div className="font-medium text-sm">{stock.name}</div>
                     <div className={`text-xs ${currentCode === stock.code ? 'text-primary-foreground/70' : 'text-zinc-500'}`}>
                        {stock.code}
                     </div>
                  </div>
                  {currentCode !== stock.code && (
                     <button
                        onClick={(e) => handleRemoveStock(e, stock.code)}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity p-1 hover:bg-white/10 rounded"
                     >
                        <Trash2 size={14} />
                     </button>
                  )}
               </Link>
            ))}
         </div>
      </div>
   );
}
