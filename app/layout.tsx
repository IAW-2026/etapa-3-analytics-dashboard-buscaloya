import type { Metadata } from "next";
import { Archivo_Black, JetBrains_Mono } from 'next/font/google';
import "./globals.css";

const archivoBlack = Archivo_Black({ 
  weight: '400', 
  subsets: ['latin'],
  variable: '--font-archivo-black'
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono'
});

export const metadata: Metadata = {
  title: "Analytics App - Etapa 2",
  description: "Módulo de analíticas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${archivoBlack.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
