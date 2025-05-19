export interface IssuancePoint {
  date: string;
  netIssuance: number;
  totalMint: number;  
  totalBurn: number;  
}

export function useIssuanceData(raw?: Array<{
  date: string;
  totalMint: string;
  totalBurn: string;
  netIssuance: string;
}>): IssuancePoint[] {
  if (!raw) return [];


  return raw.map(d => ({
    date:        d.date,
    totalMint:   Number(d.totalMint)  / 1e6,  
    totalBurn:   Number(d.totalBurn)  / 1e6,  
    netIssuance: Number(d.netIssuance) / 1e6,
  }));
}