import { gql } from '@apollo/client';

export const DAILY_ISSUANCE_QUERY = gql`
    query  GetIssuance($from: String!, $to: String!) {
        dailyIssuances(
      where: { date_gte: $from, date_lte: $to }
      orderBy: date
      orderDirection: asc
    )
      {
        id
        date
        totalMint
        totalBurn
        netIssuance
    }
    }
`;