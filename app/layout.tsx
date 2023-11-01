'use client';
import { WagmiConfig, createConfig } from 'wagmi';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import Navbar from '@/components/navigation/navbar';
import Footer from '@/components/navigation/footer';
import { base } from 'viem/chains';
import { Jumbotron } from '@/components/assets/Jumbotron';

const alchemyId = process.env.ALCHEMY_ID;

const walletConnectProjectId = process.env.WALLETCONNECT_PROJECT_ID!;

const chains = [base];

const config = createConfig(
  getDefaultConfig({
    appName: 'Base Hunt',
    alchemyId,
    walletConnectProjectId,
    chains,
  })
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <WagmiConfig config={config}>
        <ConnectKitProvider mode="dark">
          <body>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '105vh',
              }}
            >
              <Navbar />
              <Jumbotron imageUrl="/images/map.png" isCircular />
              <div style={{ flexGrow: 1 }}>{children}</div>
              <Footer />
            </div>
          </body>
        </ConnectKitProvider>
      </WagmiConfig>
    </html>
  );
}
