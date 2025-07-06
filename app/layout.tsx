import './globals.css';
import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

const Providers = dynamic(() => import('../components/Providers.tsx'), { ssr: false });

export const metadata = {
  title: 'Pharos Multisend',
  description: 'Send PHRS & verify task',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
