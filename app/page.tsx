'use client';

import '@rainbow-me/rainbowkit/styles.css';
import './globals.css';
import { useAccount, useWalletClient } from 'wagmi';
import { useState, useEffect, useRef } from 'react';
import { parseEther } from 'viem';
import { verifyTask } from '../lib/pharos';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Page() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [jwt, setJwt] = useState('');
  const [addrRaw, setAddrRaw] = useState('');
  const [addrList, setAddrList] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [amount, setAmount] = useState('0.005');
  const cancelRef = useRef(false);
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
    const res = await fetch('/api/pharos-login', {
      method: 'POST',
      body: JSON.stringify({ address, signature, walletName: 'WebApp' }),
      headers: { 'Content-Type': 'application/json' },
    });

    let data: any;
    try {
      data = await res.json(); 
    } catch {
      const txt = await res.text();
      println(`❌ Login parse error: ${txt.slice(0, 200)}`);
      alert('Login gagal (parse)');
      return;
    }

    if (!res.ok || data?.code !== 0) {
      println(`❌ Login gagal: ${data?.msg || res.statusText}`);
      alert(`Login gagal: ${data?.msg || `HTTP ${res.status}`}`);
      return;
    }

    const token = data?.data?.jwt;
    if (!token) {
      println('❌ Login response tanpa JWT');
      alert('Login gagal: JWT kosong');
      return;
    }

    setJwt(token);
    println('✅ Login berhasil');
  } catch (err: any) {
    println(`❌ Login error: ${err.message}`);
    alert('Login error: ' + err.message);
  }
};

  const sendAll = async () => {
    if (!walletClient || !address || !jwt) return;
    if (!addrList.length) return alert('Daftar address kosong');

    setBusy(true);
    cancelRef.current = false;

    for (const to of addrList) {
      if (cancelRef.current) {
        println('⛔ Dibatalkan oleh user');
        break;
      }
      try {
        const txHash = await walletClient.sendTransaction({
          account: address,
          to: to as `0x${string}`,
          value: parseEther(amount),
        });

        println(`✅ Send to ${to} | Tx: https://pharos-testnet.socialscan.io/tx/${txHash}`);

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

        <div className="flex justify-center">
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="full" />
        </div>

        {isConnected && !jwt && (
          <button
            onClick={doLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-2 font-semibold"
          >
            🔐 Login to Pharos
          </button>
        )}

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

        <div className="flex gap-4">
          <button
            disabled={busy || !jwt || !isConnected || addrList.length === 0}
            onClick={sendAll}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 rounded-lg py-2 font-semibold disabled:bg-gray-500"
          >
            {busy ? '🚀 Sending…' : `📤 Send ${addrList.length}`}
          </button>
          <button
            onClick={() => {
              cancelRef.current = true;
              setBusy(false);
            }}
            disabled={!busy}
            className="flex-1 bg-red-600 hover:bg-red-700 rounded-lg py-2 font-semibold disabled:bg-gray-500"
          >
            ⛔ Cancel
          </button>
        </div>

        <pre className="bg-black text-green-400 rounded p-3 max-h-60 overflow-y-auto text-xs whitespace-pre-wrap">
          {logs.join('\n')}
        </pre>
      </div>
    </main>
  );
}
