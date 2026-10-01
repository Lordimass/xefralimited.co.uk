import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";

import 'bootstrap/dist/css/bootstrap.css';
import "./globals.css";


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Xefra Ltd.",
    description: "Xefra Limited Staff Hub",
    robots: {index: false}
};

export default async function RootLayout({children}: LayoutProps<"/">) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} data-bs-theme="dark">
        <body>
        {children}
        </body>
        </html>
    );
}


