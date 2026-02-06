import type React from 'react';
import { MarketingLayout } from '@contractspec/lib.design-system';
import { Analytics } from '@vercel/analytics/next';
import { HStack } from '@contractspec/lib.ui-kit-web/ui/stack';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MarketingLayout header={<HStack />} footer={<HStack />}>
      {children}
      <Analytics />
    </MarketingLayout>
  );
}
