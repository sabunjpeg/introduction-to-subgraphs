'use client';                
import React from 'react';
import { useQuery } from '@apollo/client';
import { DAILY_ISSUANCE_QUERY } from '../graphql/queries';
import { useIssuanceData } from '../hooks/useIssuanceData';
import { IssuanceStats }   from './IssuanceStats';



export default function IssuanceOverview({ from, to }: { from: string; to: string }) {
    const { data, loading, error } = useQuery(DAILY_ISSUANCE_QUERY, { 
        variables: { from, to } 
        });

    const raw = data?.dailyIssuances;

    const points = useIssuanceData(raw);

    if (loading) return <p>Loading…</p>;
    if (error)   return <p>Error: {error.message}</p>;

    

    
    return (
     <>
      <IssuanceStats  data={points} />
    </>
    );
}