"use client";

import { Suspense } from "react";

import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";
import { usePathname } from "next/navigation";

import { useIsMounted } from "@/hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster as SonerToaster } from "sonner";

import { Toaster } from "@referrer/ui";

import { PreLoader } from "@/components/custom-components";
import { Banner, Footer, Navbar } from "@/components/layout";
import CookieConsent from "@/components/ui/cookie-consent";
import ProgressBar from "@/components/ui/progress-bar";

import { rootPaths } from "@/config";

import { useStore } from "@/store/store";

import Loading from "../../app/loading";
import "../../styles/globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontHeading = localFont({
  src: "../../public/fonts/cal-sans/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});

export function Provider({ children }) {
  const isMounted = useIsMounted();
  const path = usePathname();
  const toastPosition = useStore((state) => state.toastPosition);
  const showNavbar = rootPaths.includes(path);
  const queryClient = new QueryClient();

  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <Toaster />
            <SonerToaster position={toastPosition} />
            {!isMounted ? (
              <PreLoader />
            ) : (
              <>
                <ProgressBar />
                {showNavbar && (
                  <>
                    <Suspense fallback={<Loading />}>
                      <Banner />
                    </Suspense>
                    <Suspense fallback={<Loading />}>
                      <Navbar />
                    </Suspense>
                  </>
                )}
                {children}
                <CookieConsent />
                <Suspense fallback={<Loading />}>{showNavbar && <Footer />}</Suspense>
                <Analytics />
              </>
            )}
          </SessionProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}
