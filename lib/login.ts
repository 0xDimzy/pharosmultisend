import axios from 'axios';
import { Address, WalletClient } from 'viem';

const BASE_API   = process.env.NEXT_PUBLIC_BASE_API as string;
const INVITE     = process.env.INVITE_CODE || '';               

export async function loginPharosWeb(
  walletClient: WalletClient,
  address: Address,
) {
  const signature = await walletClient.signMessage({
    account: address,
    message: 'pharos',
  });
  const walletName = encodeURIComponent(
    walletClient.connector?.name?.replace(/\s+/g, '+') || 'MetaMask',
  );
  const url =
    `${BASE_API}/user/login` +
    `?address=${address}` +
    `&signature=${signature}` +
    `&wallet=${walletName}` +
    (INVITE ? `&invite_code=${INVITE}` : '');
  const { data } = await axios.post(url, null, {
    headers: {
      'Content-Type': 'application/json',
      Referer: 'https://testnet.pharosnetwork.xyz',
      Origin:  'https://testnet.pharosnetwork.xyz',
    },
  });

  const jwt = data?.data?.jwt;
  if (!jwt) throw new Error('Login gagal: ' + data?.msg);
  return jwt;
}
