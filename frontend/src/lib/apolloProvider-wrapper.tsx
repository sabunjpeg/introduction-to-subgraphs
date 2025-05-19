'use client'

import { ApolloProvider } from '@apollo/client';
import React from 'react';
import { createApolloClient } from './apollo-client';

export function ApolloProviderWrapper({ children }: { children: React.ReactNode }) {
    const client = React.useMemo(() => createApolloClient(), []);

    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
}