export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const { jwt, address, txHash, taskId } = await req.json();
    const url = `https://api.pharosnetwork.xyz/task/verify`;

    const payload = {
      address,
      task_id: Number(taskId),
      tx_hash: txHash,
    };

    const res = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Referer: 'https://testnet.pharosnetwork.xyz',
        Origin: 'https://testnet.pharosnetwork.xyz',
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    return NextResponse.json(
      { code: -1, msg: err?.response?.data?.msg || err.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
