# introduction-to-subgraphs
Progressive learning repo on subgraph indexing


This project indexes the USDC contract, which follows a proxy pattern.  
The proxy contract at `0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48` delegates all logic to its current implementation contract at `0x43506849d7c04f9138d1a2050bbf3a0c054402dd`.

Therefore, this subgraph **uses the ABI of the implementation contract** (to access events like `Transfer`, `Approval`, etc.) but sets the **source address to the proxy**, since that’s where events are emitted on-chain.
