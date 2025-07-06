'use client';

import '@rainbow-me/rainbowkit/styles.css';
import './globals.css';
import { useAccount, useWalletClient } from 'wagmi';
import { useState, useEffect } from 'react';
import { parseEther } from 'viem';
import { verifyTask } from '../lib/pharos';
import { ConnectButton } from '@rainbow-me/rainbowkit';


export default function Page() {
  const { address, isConnected, connector } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [jwt, setJwt] = useState('');
  const [addrRaw, setAddrRaw] = useState('');
  const [addrList, setAddrList] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [amount, setAmount] = useState('0.005');
  const taskId = '103';

  const println = (msg: string) => setLogs((l) => [...l, msg]);

  useEffect(() => {
    const list = addrRaw
      .split(/[\n,\s]+/)
      .map((a) => a.trim())
      .filter((a) => a.startsWith('0x') && a.length === 42);
    setAddrList(list);
  }, [addrRaw]);

  const doLogin = async () => {
    if (!walletClient || !address) return;
    try {
      const signature = await walletClient.signMessage({
        account: address,
        message: 'pharos',
      });

      const walletName = connector?.name || 'Wallet';
      const res = await fetch('/api/pharos-login', {
        method: 'POST',
        body: JSON.stringify({ address, signature, walletName }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (!data?.data?.jwt) return alert('Login gagal: ' + data?.msg || 'Unknown');
      setJwt(data.data.jwt);
      println('✅ Login berhasil');
    } catch (err: any) {
      alert('Login error: ' + err.message);
    }
  };

  const sendAll = async () => {
    if (!walletClient || !address || !jwt) return;
    if (!addrList.length) return alert('Daftar address kosong');

    setBusy(true);

    for (const to of addrList) {
      try {
        const txHash = await walletClient.sendTransaction({
          account: address,
          to: to as `0x${string}`,
          value: parseEther(amount),
        });

        println(`✅Sending to: ${to} | TxHash: https://pharos-testnet.socialscan.io/tx/${txHash}`);

        await new Promise((r) => setTimeout(r, 10_000));
        await verifyTask(jwt, address, txHash, taskId);
        println('   ↳ ✅ Verified');
      } catch (e: any) {
        println(`❌ ${to} | ${e.message}`);
      }
      await new Promise((r) => setTimeout(r, 10_000));
    }

    setBusy(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur rounded-2xl p-6 space-y-5">
        <h1 className="text-3xl font-bold text-indigo-300 text-center">Pharos Multisend</h1>

        <div className="flex justify-center items-center">
          <ConnectButton
            showBalance={false}
            chainStatus="icon"
            accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }}
          />
        </div>

        {isConnected && !jwt && (
          <button
            onClick={doLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-2 font-semibold"
          >
            🔐 Login to Pharos
          </button>
        )}

        <div className="text-sm text-red-300 text-center">
          {!isConnected && '🔌 Wallet belum terkoneksi'}<br />
          {isConnected && !jwt && '🔐 Belum login Pharos'}<br />
          {busy && '⏳ Sedang mengirim...'}
        </div>

        <textarea
          className="w-full p-3 rounded text-black"
          rows={5}
          placeholder="0xabc... satu per baris / spasi"
          value={addrRaw}
          onChange={(e) => setAddrRaw(e.target.value)}
        />
        <p className="text-xs text-gray-300">{addrList.length} address valid</p>

        <div className="flex gap-4">
          <button
            onClick={() => setAmount('0.001')}
            className={`flex-1 py-2 rounded-lg font-semibold ${
              amount === '0.001' ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            0.001 PHRS
          </button>
          <button
            onClick={() => setAmount('0.005')}
            className={`flex-1 py-2 rounded-lg font-semibold ${
              amount === '0.005' ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            0.005 PHRS
          </button>
        </div>

        <button
          disabled={busy || !jwt || !isConnected || addrList.length === 0}
          onClick={sendAll}
          className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-lg py-2 font-semibold disabled:bg-gray-500"
        >
          {busy ? '🚀 Sending…' : `📤 Send to ${addrList.length} address`}
        </button>

        <pre className="bg-black text-green-400 rounded p-3 max-h-60 overflow-y-auto text-xs whitespace-pre-wrap">
          {logs.join('\n')}
        </pre>
      </div>
    </main>
  );
}
