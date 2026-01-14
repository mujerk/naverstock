'use client';

import { useState, useEffect } from 'react';

export default function LoginGuard({ children }: { children: React.ReactNode }) {
   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [id, setId] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');

   useEffect(() => {
      const storedLogin = localStorage.getItem('isLoggedIn');
      if (storedLogin === 'true') {
         setIsLoggedIn(true);
      }
      setIsLoading(false);
   }, []);

   const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (id === 'mujerk' && password === 'm12345') {
         localStorage.setItem('isLoggedIn', 'true');
         setIsLoggedIn(true);
         setError('');
      } else {
         setError('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
   };

   if (isLoading) {
      return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
   }

   if (!isLoggedIn) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <div className="w-full max-w-md p-8 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl">
               <h1 className="text-2xl font-bold mb-6 text-center text-primary">Login</h1>
               <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium mb-1 text-zinc-400">ID</label>
                     <input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-primary text-white"
                        placeholder="아이디를 입력하세요"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium mb-1 text-zinc-400">Password</label>
                     <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-primary text-white"
                        placeholder="비밀번호를 입력하세요"
                     />
                  </div>
                  {error && (
                     <p className="text-red-500 text-sm text-center">{error}</p>
                  )}
                  <button
                     type="submit"
                     className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors"
                  >
                     로그인
                  </button>
               </form>
            </div>
         </div>
      );
   }

   return <>{children}</>;
}
