import type { Metadata } from "next";
import "./globals.css";
import PrivyProvider from "@/components/provider";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import AuthButton from "@/components/header-auth";
import { Fredoka, Raleway } from "next/font/google";


const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["300", "400", "500", "600", "700"],
});

const raleWay = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["300", "400", "500", "600", "700"],
});

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

export const metadata: Metadata = {
  title: "Borderless",
  description: "Money Beyond Borders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={raleWay.variable}
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PrivyProvider>
              <main className="min-h-screen flex flex-col items-center">
                <div className="flex-1 w-full flex flex-col items-center h-full">
                  <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 z-50">
                    <div className="w-full max-w-5xl flex justify-between items-center p-3 text-sm">
                      <div className="flex gap-5 items-center font-semibold">
                        <Link href="/" className="flex items-center gap-2">
                          BORDERLESS
                        </Link>
                      </div>
                      <div className="flex items-center">
                        <AuthButton />
                        <ThemeSwitcher />
                      </div>
                    </div>
                  </nav>
                  <div className="flex flex-1 justify-center items-center w-full h-full max-w-5xl">
                    Stuff
                    {children}
                  </div>
                </div>
              </main>
          </PrivyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
