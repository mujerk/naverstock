'use client';

import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

interface JsonViewerProps {
   title: string;
   data: any;
   isLoading?: boolean;
   error?: string | null;
}

export default function JsonViewer({ title, data, isLoading, error }: JsonViewerProps) {
   const [copied, setCopied] = useState(false);

   const handleCopy = () => {
      if (data) {
         navigator.clipboard.writeText(JSON.stringify(data, null, 2));
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      }
   };

   return (
      <div className="flex flex-col h-full bg-card border border-white/10 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
         <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
            <h3 className="font-semibold text-sm text-foreground/90 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-primary/70"></span>
               {title}
            </h3>
            <button
               onClick={handleCopy}
               disabled={!data || isLoading}
               className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
            >
               {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
               {copied ? 'Copied' : 'Copy JSON'}
            </button>
         </div>
         <div className="flex-1 relative bg-black/40 h-[50px] overflow-hidden group">
            <div className="absolute inset-0 overflow-auto custom-scrollbar p-4">
               {isLoading ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm animate-pulse">
                     Loading data...
                  </div>
               ) : error ? (
                  <div className="flex items-center justify-center h-full text-red-400 text-sm">
                     {error}
                  </div>
               ) : (
                  <pre className="text-xs font-mono leading-relaxed text-blue-200/90 whitespace-pre-wrap break-all">
                     {JSON.stringify(data, null, 2)}
                  </pre>
               )}
            </div>
         </div>
      </div>
   );
}
