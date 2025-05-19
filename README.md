# Introduction to Subgraphs

This project demonstrates how to build and use a subgraph with The Graph Protocol to index and query data from the Ethereum blockchain, and then display this data in a Next.js frontend application. Specifically, it focuses on indexing USDC transfer events.

## Project Structure

The project is organized into two main components:

1.  `usdc-subgraph-2/`: This directory contains the subgraph project.
    *   `subgraph.yaml`: The manifest file that defines the subgraph, including the data sources, entities, and event handlers.
    *   `schema.graphql`: Defines the structure of the data to be stored and queried (e.g., `TransferEvent` entities).
    *   `src/fiat-token-v-2-2.ts`: Contains the AssemblyScript mapping code that processes USDC Transfer events and transforms them into GraphQL entities for indexing.
    * `src/usdc-metrics.ts` : This code tracks and updates the daily total mint, burn, and net issuance of a token by date using The Graph’s subgraph handlers for Mint and Burn events.
    *   `package.json`: Manages dependencies and scripts for building and deploying the subgraph.

2.  `frontend/`: Next.js App Router frontend that queries the USDC subgraph and visualizes data.
    *   `app/`: Root layout, homepage, and global styles (Tailwind).
    *   `components/`:  Reusable client components (chart, stats, query wrapper).
    *   `graphql/`: GraphQL query definitions.
    *   `hooks/`: Pure data transformation utility.
    *  `lib/`: Apollo client setup and formatting helpers.
    *   `package.json`: Manages dependencies and scripts for running the frontend application.

## How it Works

1.  **Smart Contract Events:** The USDC smart contract on the Ethereum blockchain emits `Transfer` events whenever USDC tokens are transferred.
2.  **Subgraph Indexing:** The subgraph (`usdc-subgraph-2`) listens for these `Transfer` events.
3.  **Mapping:** When an event is detected, the `mapping.ts` script processes the event data and saves it as a `TransferEvent` entity in The Graph Node's database, according to the `schema.graphql`.
4.  **GraphQL API:** The Graph Node exposes a GraphQL API that allows querying the indexed data.
5.  **Frontend Application:** The Next.js frontend application uses Apollo Client to send GraphQL queries to the subgraph's API and retrieve the `TransferEvent` data.
6.  **Display:** The frontend then displays this data, for example, in a chart or a table.

## Running the Project Locally

To run this project locally, you'll need to set up and run both the subgraph and the frontend application.

### Prerequisites

*   **Node.js and npm/yarn:** For both the subgraph and frontend.
*   **Docker:** Required for running a local Graph Node. Make sure Docker is installed and running.
*   **Graph CLI:** Install it globally if you haven't already:
    ```bash
    npm install -g @graphprotocol/graph-cli
    # or
    yarn global add @graphprotocol/graph-cli
    ```

### 1. Running the Subgraph (`usdc-subgraph-2/`)

First, you need to run a local Graph Node. The easiest way is often using Docker. Refer to the official Graph Protocol documentation for setting up a local Graph Node instance. Once your local Graph Node is running (typically exposing endpoints on `http://localhost:8020/` for deployment and `http://localhost:8000/` for queries):

1.  **Navigate to the subgraph directory:**
    ```bash
    cd usdc-subgraph-2
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Generate code from the schema:** This command generates AssemblyScript types from your `subgraph.yaml` and `schema.graphql`.
    ```bash
    npm run codegen
    # or
    yarn codegen
    ```

4.  **Build the subgraph:** This compiles your mapping scripts and prepares the subgraph for deployment.
    ```bash
    npm run build
    # or
    yarn build
    ```

5.  **Create the subgraph instance on your local Graph Node:**
    ```bash
    npm run create-local
    # or
    yarn create-local
    ```
    *(This script typically runs `graph create --node http://localhost:8020/ usdc-subgraph-2`)*

6.  **Deploy the subgraph to your local Graph Node:**
    ```bash
    npm run deploy-local
    # or
    yarn deploy-local
    ```
    *(This script typically runs `graph deploy --node http://localhost:8020/ --ipfs http://localhost:5001 usdc-subgraph-2`)*

After deployment, your subgraph will start indexing events. You can check its status and query it via the local Graph Node's GraphiQL interface (usually `http://localhost:8000/subgraphs/name/usdc-subgraph-2/graphql`).

### 2. Running the Frontend (`frontend/`)

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    # (Assuming you are in usdc-subgraph-2 directory)
    # or from the project root:
    # cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Subgraph URL (if necessary):**
    The frontend needs to know where to query the subgraph. This is typically configured in an environment variable or directly in the Apollo Client setup. For a local deployment, the URL will be something like `http://localhost:8000/subgraphs/name/usdc-subgraph-2`. Ensure your frontend code (e.g., Apollo Client instance) is pointing to this local endpoint.

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    This will start the Next.js application, usually on `http://localhost:3000`.

Now you can open your browser and navigate to `http://localhost:3000` to see the frontend application interacting with your locally running subgraph.

## Further Information

*   **The Graph Protocol Documentation:** [https://thegraph.com/docs/](https://thegraph.com/docs/)
*   **Next.js Documentation:** [https://nextjs.org/docs](https://nextjs.org/docs)
*   **Apollo Client Documentation:** [https://www.apollographql.com/docs/react/](https://www.apollographql.com/docs/react/)
*   **Making the subgraph tutorial:** [https://www.youtube.com/watch?v=EJ2em_QkQWU&t=775s]


This README provides a basic guide. Depending on the specifics of the USDC contract version and network you are targeting (e.g., mainnet, testnet), you might need to adjust the contract address and network in `subgraph.yaml`.
