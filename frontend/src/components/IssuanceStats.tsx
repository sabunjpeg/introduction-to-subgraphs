'use client';

import React from 'react';
import { IssuancePoint } from '../hooks/useIssuanceData';
import { formatUSDC } from '../lib/format';

export function IssuanceStats({ data }: { data: IssuancePoint[] }) {

    const minted = data.map(d => d.totalMint);
    const burned = data.map(d => d.totalBurn);
    const values     = data.map(d => d.netIssuance);

    const sum = (arr: number[]) => arr.reduce((s, x) => s + x, 0);
    const totalMinted = sum(minted);
    const totalBurned = sum(burned);
    const totalNet     = sum(values);
    const avgNet       = totalNet / values.length;
    const maxVal       = Math.max(...values);
    const minVal       = Math.min(...values);
    const maxDay       = data.find(d => d.netIssuance === maxVal)?.date ?? '-';
    const minDay       = data.find(d => d.netIssuance === minVal)?.date ?? '-';

    const stats = [
    { label: 'Total minted', value: totalMinted },
    { label: 'Total burned', value: totalBurned },
    { label: 'Net total',    value: totalNet },
    { label: 'Daily avg',    value: avgNet },
    { label: 'Max issuance', value: maxVal, extra: `on ${maxDay}` },
    { label: 'Min issuance', value: minVal, extra: `on ${minDay}` },
  ];

    return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map(({ label, value, extra }) => (
        <div
          key={label}
          className="bg-white/10 p-4 rounded-lg backdrop-blur-sm flex flex-col items-center"
        >
          <div className="text-2xl font-bold text-white">
            {formatUSDC(value)}
          </div>
          <div className="mt-1 text-sm text-gray-300 text-center">
            {label}{extra ? ` on ${extra}` : ''}
          </div>
        </div>
      ))}
    </div>
  )
}