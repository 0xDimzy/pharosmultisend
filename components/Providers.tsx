'use client';

import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { pharos } from '../lib/pharosChain';

const PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_ID as string;

const { connectors } = getDefaultWallets({
  appName: 'Pharos Multisend',
  projectId: PROJECT_ID,
  chains: [pharos],
});

const config = createConfig({
  chains: [pharos],
  connectors,
  transports: {
    [pharos.id]: http(pharos.rpcUrls.default.http[0]),
  },
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={[pharos]}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
