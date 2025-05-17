# introduction-to-subgraphs
Progressive learning repo on subgraph indexing

This project indexes the USDC (USD Coin) contract, focusing on its `Transfer`, `Mint`, and `Burn` events. It also calculates daily issuance metrics.

## USDC Contract and Proxy Pattern
This project indexes the USDC contract, which follows a proxy pattern.
The proxy contract at `0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48` delegates all logic to its current implementation contract (e.g., `0x43506849d7c04f9138d1a2050bbf3a0c054402dd` or newer versions).

Therefore, this subgraph **uses the ABI of the implementation contract** (to access events like `Transfer`, `Approval`, etc.) but sets the **source address to the proxy**, since that’s where events are emitted on-chain.

## Indexed Events
The subgraph specifically tracks:
*   **Transfer events:** Recording standard token transfers.
*   **Mint events:** Recording the creation of new USDC tokens.
*   **Burn events:** Recording the destruction of USDC tokens.

## Metrics: Daily Issuance
The subgraph calculates and stores daily metrics for USDC issuance in the `DailyIssuance` entity. For each day:
*   `id`: The date in ISO format (YYYY-MM-DD).
*   `date`: The date in ISO format (YYYY-MM-DD).
*   `totalMint`: The total amount of USDC minted on that day.
*   `totalBurn`: The total amount of USDC burned on that day.
*   `netIssuance`: The net change in USDC supply for that day (`totalMint` - `totalBurn`).
*   `lastUpdatedBlock`: The block number of the last event that updated this daily record.

The formula for net daily issuance is:
NetDailyIssuance(date) = Σ Mint.amount (all mints on that date) – Σ Burn.amount (all burns on that date)

This metric provides insight into the daily expansion or contraction of the USDC supply.