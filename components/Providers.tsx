'use client';

import { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import {
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { defineChain } from 'viem';

const pharos = defineChain({
  id: 688688,
  name: 'Pharos Testnet',
  nativeCurrency: { name: 'PHRS', symbol: 'PHRS', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet.dplabs-internal.com/'] },
  },
});

const { wallets } = getDefaultWallets({
  appName: 'Pharos Multisend',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID || '',
});

const config = createConfig({
  chains: [pharos],
  connectors: wallets,
  transports: {
    [pharos.id]: http('https://testnet.dplabs-internal.com/'),
  },
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* ✅ Tidak perlu chains di sini */}
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
