import React from 'react';
import { IssuanceChart }from '../components/IssuanceChart';
import IssuanceOverview from '../components/IssuanceOverview';


export default function Home() {
  const today = new Date().toISOString().split('T')[0];

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  // const { points, loading, error } = useIssuanceData(thirtyDaysAgo, today);
  // if (loading) return <p>Loading data…</p>;
  // if (error)   return <p>Error: {error.message}</p>;



  return (
       <main className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-semibold text-white">
        USDC Net Issuance (Last 30 Days)
      </h1>

       <div className="mt-6 bg-white/5 p-4 rounded-lg">
       <IssuanceChart from={thirtyDaysAgo} to={today} />
       <IssuanceOverview from={thirtyDaysAgo} to={today} />
       </div>
      
    </main>
  );
}
