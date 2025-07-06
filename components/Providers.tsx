'use client';

import { ReactNode } from 'react';
import {
  WagmiProvider,
  createConfig,
  http,
} from 'wagmi';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

const pharos = defineChain({
  id: 688688,
  name: 'Pharos Testnet',
  nativeCurrency: {
    name: 'PHRS',
    symbol: 'PHRS',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.dplabs-internal.com'],
    },
  },
});

const { connectors } = getDefaultWallets({
  appName: 'Pharos Multisend',
  projectId: 'pharos-multisend',
  chains: [pharos],
});

const config = createConfig({
  connectors,
  chains: [pharos],
  transports: {
    [pharos.id]: http(pharos.rpcUrls.default.http[0]),
  },
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider chains={[pharos]} avatar={() => null}>
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
