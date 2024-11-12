'use client';

import {PrivyProvider} from '@privy-io/react-auth';
import { useTheme } from "next-themes";

export default function PrivyProviders({children}: {children: React.ReactNode}) {
  const { theme, setTheme } = useTheme();

  return (
    <PrivyProvider
    appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: theme === "dark" ? 'dark' : 'light',
          accentColor: '#676FFF',
          // logo: 'https://your-logo-url',
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}