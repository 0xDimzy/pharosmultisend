export async function verifyTask(
  jwt: string,
  address: string,
  txHash: string,
  taskId: string
) {
  const res = await fetch('/api/verify-task', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jwt, address, txHash, taskId }),
  });

  const data = await res.json();
  if (data.code !== 0) throw new Error(data.msg || 'Verifikasi gagal');
  return true;
}
