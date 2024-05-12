import type {Metadata} from "next";
import "./globals.scss";
import {Play} from "next/font/google";
import {Toaster} from "@/components/ui/toaster";
import {cn} from "@/lib/utils";

const fontLayout = Play({subsets: ['latin'], weight: '400'})

export const metadata: Metadata = {
    title: "Anonymous Chat | Can Korkmaz",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn('bg-black bg-cover bg-no-repeat h-screen flex items-center justify-center text-[14px] dark', fontLayout.className)}>
                {children}
                <Toaster/>
            </body>
        </html>
    );
}
