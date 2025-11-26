import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import Navigation from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
    title: "Financial Agent - Dashboard",
    description: "Gestão Financeira Inteligente",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="pt-BR">
                <body className="antialiased">
                    <Navigation />
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
