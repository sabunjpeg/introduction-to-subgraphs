import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
});

const cache = new InMemoryCache();


// export const apolloClient = new ApolloClient({
//     link: httpLink,
//     cache: cache,
// })

export function createApolloClient() {
    return new ApolloClient({
        link: httpLink,
        cache: cache,
    });
}