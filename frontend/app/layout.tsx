import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Rodape from "./componentes/Rodape";
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
  title: "Moeda Estudantil",
  description: "Sistema de reconhecimento do mérito estudantil com moedas e vantagens.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
      <html
          lang="pt-BR"
          className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
      <body className="min-h-full flex flex-col">
        {children}
        <Rodape />
      </body>
      </html>
  );
}