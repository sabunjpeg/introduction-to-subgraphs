'use client'

import { useQuery } from "@apollo/client"
import { DAILY_ISSUANCE_QUERY } from "../graphql/queries"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatUSDC } from "@/lib/format";      

interface DataPoint {
  date: string;
  netIssuance: number;
}

export function IssuanceChart({ from, to }: { from: string; to: string }) {
    const { data, loading, error } = useQuery(DAILY_ISSUANCE_QUERY, {
    variables: { from, to },
  });


    if (loading) return <p>Loading…</p>;
    if (error)   return <p>Error: {error.message}</p>;

    const chartData: DataPoint[] = data.dailyIssuances.map((d: any) => ({
    date: d.date,
    netIssuance: Number(d.netIssuance) / 1e6 / 1e6,
  }));



  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis 
        tickFormatter={v => formatUSDC(v as number)}
        />

        <Tooltip 
        formatter={(v) =>`${formatUSDC(v as number)} USDC`}
        />
        
        <Line type="monotone" dataKey="netIssuance" stroke="#8884d8" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );

}
