import { redirect } from 'next/navigation';

export default function Home() {
   // Redirect to Samsung Electronics (005930) by default
   redirect('/005930');
}
