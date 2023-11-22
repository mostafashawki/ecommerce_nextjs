"use client";
import "./globals.css";
import "bootstrap-material-design/dist/css/bootstrap-material-design.min.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import TopNav from "@/components/nav/TopNav";
import { Toaster } from "react-hot-toast";
// to wrap the entire app with session provider
import { SessionProvider } from "next-auth/react";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ErrorBoundary>
        <SessionProvider>
          <body>
            <TopNav />
            <Toaster />
            {children}
          </body>       
        </SessionProvider>
      </ErrorBoundary>
    </html>
  );
}
