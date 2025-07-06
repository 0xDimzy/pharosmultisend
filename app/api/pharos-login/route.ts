// app/api/pharos-login/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('🛬  /api/pharos-login hit');

  try {
    const { address, signature, walletName } = await req.json();

    const url =
      `https://api.pharosnetwork.xyz/user/login` +
      `?address=${address}` +
      `&signature=${encodeURIComponent(signature)}` +
      `&wallet=${encodeURIComponent(walletName)}` +
      `&invite_code=${process.env.INVITE_CODE || ''}`;

    console.log('[login] url:', url);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://testnet.pharosnetwork.xyz',
        Origin:  'https://testnet.pharosnetwork.xyz',
      },
    });

    const data = await res.json();
    console.log('[login] data:', data);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[Login Error]', err);
    return NextResponse.json(
      { code: 1, msg: err?.message ?? 'unknown' },
      { status: 200 },       
    );
  }
}
