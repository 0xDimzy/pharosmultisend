import { defineChain } from 'viem';

export const pharos = defineChain({
  id: 688688,
  name: 'Pharos Testnet',
  nativeCurrency: { name: 'PHRS', symbol: 'PHRS', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet.dplabs-internal.com/'] },
  },
});
