'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface TradingHoursModalProps {
   isOpen: boolean;
   onClose: () => void;
}

export default function TradingHoursModal({ isOpen, onClose }: TradingHoursModalProps) {
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
   }, []);

   if (!mounted || !isOpen) return null;

   return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
         <div className="bg-background border border-white/10 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
               <h2 className="text-lg font-bold text-foreground">거래시간안내</h2>
               <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-white/10"
               >
                  <X size={20} />
               </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[80vh]">
               <p className="text-sm text-muted-foreground mb-4">
                  NXT 거래가능 종목 거래시간안내 표입니다.
               </p>

               <div className="overflow-hidden rounded-lg border border-white/10">
                  <table className="w-full text-sm text-left">
                     <thead className="bg-white/5 text-muted-foreground font-medium">
                        <tr>
                           <th className="p-3 border-b border-white/10 w-1/3">구분</th>
                           <th className="p-3 border-b border-white/10 w-1/3 text-center">시간</th>
                           <th className="p-3 border-b border-white/10 w-1/3 text-center">거래 가능 거래소</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        <tr className="hover:bg-white/5 transition-colors">
                           <td className="p-3">프리마켓</td>
                           <td className="p-3 text-center font-mono">08:00~08:50</td>
                           <td className="p-3 text-center font-semibold text-primary">NXT</td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                           <td className="p-3">장전 시간외</td>
                           <td className="p-3 text-center font-mono">08:30~08:40</td>
                           <td className="p-3 text-center">KRX</td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                           <td className="p-3">장전 동시호가</td>
                           <td className="p-3 text-center font-mono">08:30~09:00</td>
                           <td className="p-3 text-center">KRX</td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                           <td className="p-3">
                              <div className="font-semibold">정규장(KRX)</div>
                              <div className="text-xs text-muted-foreground">메인마켓(NXT)</div>
                           </td>
                           <td className="p-3 text-center font-mono align-middle">
                              09:00~15:20
                              <div className="text-[10px] text-muted-foreground mt-0.5">NXT 09:00:30~</div>
                           </td>
                           <td className="p-3 text-center align-middle">
                              KRX, <span className="font-semibold text-primary">NXT</span>
                           </td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                           <td className="p-3">장후 동시호가</td>
                           <td className="p-3 text-center font-mono">15:20~15:30</td>
                           <td className="p-3 text-center">KRX</td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors bg-red-500/5">
                           <td className="p-3 text-red-400 font-medium">NXT 거래중지</td>
                           <td className="p-3 text-center font-mono text-red-400">15:20~15:30</td>
                           <td className="p-3 text-center text-red-400">-</td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                           <td className="p-3">장후 시간외</td>
                           <td className="p-3 text-center font-mono">15:40~16:00</td>
                           <td className="p-3 text-center">KRX</td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                           <td className="p-3 font-semibold text-primary">애프터마켓</td>
                           <td className="p-3 text-center font-mono text-primary">15:30~20:00</td>
                           <td className="p-3 text-center font-semibold text-primary">NXT</td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                           <td className="p-3 font-medium">장마감</td>
                           <td className="p-3 text-center font-mono">20:00~08:00</td>
                           <td className="p-3 text-center text-xs text-muted-foreground">
                              KRX, NXT 종가 마감
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5 text-center">
               <button
                  onClick={onClose}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
               >
                  닫기
               </button>
            </div>
         </div>
      </div>,
      document.body
   );
}
