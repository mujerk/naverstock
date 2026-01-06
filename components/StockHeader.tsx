'use client';

interface StockHeaderProps {
   name: string;
   code: string;
   price?: string;
   change?: string;
}

export default function StockHeader({ name, code }: StockHeaderProps) {
   return (
      <div className="mb-6 flex items-end gap-3 px-1">
         <h1 className="text-3xl font-bold text-foreground tracking-tight">{name}</h1>
         <span className="text-xl text-muted-foreground font-mono mb-1">{code}</span>
         <div className="ml-auto flex items-center gap-2">
            <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs text-green-500 font-medium tracking-wide">LIVE DATA</span>
         </div>
      </div>
   );
}
