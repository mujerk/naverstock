import StockDashboard from '@/components/StockDashboard';

interface PageProps {
   params: {
      code: string;
   }
}

export default function Page({ params }: PageProps) {
   return <StockDashboard code={params.code} />;
}
