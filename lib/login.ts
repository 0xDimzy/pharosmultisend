// lib/loginPharosWeb.ts
import axios from 'axios';
import { Address, WalletClient } from 'viem';

const BASE_API   = process.env.NEXT_PUBLIC_BASE_API as string;   // https://api.pharosnetwork.xyz
const INVITE     = process.env.INVITE_CODE || '';                // opsional

export async function loginPharosWeb(
  walletClient: WalletClient,
  address: Address,
) {
  /* 1) sign message */
  const signature = await walletClient.signMessage({
    account: address,
    message: 'pharos',
  });

  /* 2) wallet param (MetaMask / OKX Wallet / Rabby) */
  const walletName = encodeURIComponent(
    walletClient.connector?.name?.replace(/\s+/g, '+') || 'MetaMask',
  );

  /* 3) compose URL */
  const url =
    `${BASE_API}/user/login` +
    `?address=${address}` +
    `&signature=${signature}` +
    `&wallet=${walletName}` +
    (INVITE ? `&invite_code=${INVITE}` : '');

  /* 4) call API */
  const { data } = await axios.post(url, null, {
    headers: {
      'Content-Type': 'application/json',
      Referer: 'https://testnet.pharosnetwork.xyz',
      Origin:  'https://testnet.pharosnetwork.xyz',
    },
  });

  const jwt = data?.data?.jwt;
  if (!jwt) throw new Error('Login gagal: ' + data?.msg);
  return jwt;          // ⬅️  pakai di page.tsx
}
