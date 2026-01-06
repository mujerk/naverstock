'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';

interface Stock {
   name: string;
   code: string;
}

interface SidebarProps {
   onSelectStock: (stock: Stock) => void;
   selectedStock: Stock;
}

const INITIAL_STOCKS: Stock[] = [
   { name: '하나금융지주', code: '086790' },
   { name: 'SK텔레콤', code: '017670' },
   { name: '삼성전자', code: '005930' },
   { name: '현대차', code: '005380' },
   { name: '한국전력', code: '015760' },
   { name: '기아', code: '000270' },
   { name: '현대로템', code: '064350' },
   { name: 'LS', code: '006260' },
   { name: '오리온', code: '271560' },
   { name: '한국항공우주', code: '047810' },
];

export default function Sidebar({ onSelectStock, selectedStock }: SidebarProps) {
   const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
   const [isAdding, setIsAdding] = useState(false);
   const [newStock, setNewStock] = useState({ name: '', code: '' });
   const [isLoaded, setIsLoaded] = useState(false);

   // Load from LocalStorage on mount
   useEffect(() => {
      const savedStocks = localStorage.getItem('my_stocks');
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
         localStorage.setItem('my_stocks', JSON.stringify(stocks));
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
      e.stopPropagation();
      setStocks(stocks.filter(s => s.code !== code));
   };

   return (
      <div className="w-full md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-white/10 bg-background/50 flex flex-col backdrop-blur-sm">
         <div className="p-4 border-b border-white/10 flex justify-between items-center md:block">
            <h1 className="text-xl font-bold text-primary mb-2 md:mb-2 flex items-center gap-2">
               Stock API
            </h1>

            {/* Mobile: Select Box */}
            <div className="md:hidden flex-1 ml-4">
               <select
                  value={JSON.stringify(selectedStock)}
                  onChange={(e) => onSelectStock(JSON.parse(e.target.value))}
                  className="w-full bg-card border border-white/20 text-foreground rounded px-3 py-2 text-sm outline-none focus:border-primary"
               >
                  {stocks.map(stock => (
                     <option key={stock.code} value={JSON.stringify(stock)}>
                        {stock.name} ({stock.code})
                     </option>
                  ))}
               </select>
            </div>

            {/* Desktop: Add Button (Hidden on mobile for simplicity as requested, or can be added if needed) */}
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
               <div
                  key={stock.code}
                  onClick={() => onSelectStock(stock)}
                  className={`
              w-full text-left px-4 py-3 rounded-lg mb-1 flex justify-between items-center group cursor-pointer transition-all duration-200
              ${selectedStock.code === stock.code
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground hover:translate-x-1'
                     }
            `}
               >
                  <div>
                     <div className="font-medium text-sm">{stock.name}</div>
                     <div className={`text-xs ${selectedStock.code === stock.code ? 'text-primary-foreground/70' : 'text-zinc-500'}`}>
                        {stock.code}
                     </div>
                  </div>
                  {selectedStock.code !== stock.code && (
                     <button
                        onClick={(e) => handleRemoveStock(e, stock.code)}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity p-1"
                     >
                        <Trash2 size={14} />
                     </button>
                  )}
               </div>
            ))}
         </div>
      </div>
   );
}
