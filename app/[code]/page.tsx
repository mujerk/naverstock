import StockDashboard from '@/components/StockDashboard';
import { fetchStockData } from '@/lib/naverApi';

interface PageProps {
   params: {
      code: string;
   }
}

export default async function Page({ params }: PageProps) {
   const initialData = await fetchStockData(params.code);
   return <StockDashboard code={params.code} initialData={initialData} />;
}
