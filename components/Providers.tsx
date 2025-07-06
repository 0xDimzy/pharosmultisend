'use client';

import { ReactNode } from 'react';
import {
  WagmiProvider,
  createConfig,
  http,
} from 'wagmi';
import {
  RainbowKitProvider,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  okxWallet,
  bitgetWallet,
} from '@rainbow-me/rainbowkit/wallets';
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

const PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ projectId: PROJECT_ID, chains: [pharos] }),
      okxWallet({ projectId: PROJECT_ID, chains: [pharos] }),
      bitgetWallet({ projectId: PROJECT_ID, chains: [pharos] }),
    ],
  },
]);

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
