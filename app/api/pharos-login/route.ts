export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BASE_API  = process.env.NEXT_PUBLIC_BASE_API || 'https://api.pharosnetwork.xyz';
const INVITE    = process.env.INVITE_CODE;
const REFERER   = 'https://testnet.pharosnetwork.xyz';
const ORIGIN    = 'https://testnet.pharosnetwork.xyz';

export async function POST(req: NextRequest) {
  try {
    const { address, signature, walletName } = await req.json();

    if (!address || !signature) {
      return NextResponse.json(
        { code: -1, msg: 'Missing address/signature' },
        { status: 400 },
      );
    }
    const params = new URLSearchParams({
      address,
      signature,
    });
    if (INVITE) params.set('invite_code', INVITE);
    if (walletName) params.set('wallet', walletName);

    const url = `${BASE_API}/user/login?${params.toString()}`;

    const res = await axios.post(url, null, {
      headers: {
        Referer: REFERER,
        Origin: ORIGIN,
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
      },
      timeout: 20_000,
      validateStatus: () => true,
    });
    return NextResponse.json(
      res.data ?? { code: -1, msg: 'Empty response from Pharos' },
      { status: res.status || 200 },
    );
  } catch (err: any) {
    const msg = err?.message || 'Unknown error';
    console.error('[pharos-login] error:', err);
    return NextResponse.json({ code: -1, msg }, { status: 500 });
  }
}
