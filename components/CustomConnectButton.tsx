'use client';

import {
  useAccount,
  useDisconnect,
} from 'wagmi';
import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Blockies from 'react-blockies';

export default function CustomConnectButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);

  const shortAddr = (addr = '') => addr.slice(0, 6) + '...' + addr.slice(-4);

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isConnected) return <ConnectButton showBalance={false} accountStatus="full" />;

  return (
    <div className="flex items-center gap-4 bg-black/30 p-3 rounded-xl shadow-md text-sm">
      <Blockies seed={address?.toLowerCase() || ''} size={8} scale={4} className="rounded-full" />
      <div className="flex-1">
        <p className="font-mono text-white">{shortAddr(address)}</p>
        <div className="flex gap-2 mt-1">
          <button
            onClick={copyAddress}
            className="text-xs text-gray-300 hover:text-white transition"
          >
            {copied ? '📋 Copied' : '📎 Copy'}
          </button>
          <button
            onClick={() => disconnect()}
            className="text-xs text-red-400 hover:text-red-500 transition"
          >
            🔌 Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}
