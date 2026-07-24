import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Source_Serif_4 } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif-4",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const baseUrl = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Monteiro — Sociedade de Advogados",
    template: "%s — Monteiro",
  },
  description:
    "Plataforma para gestão de processos, movimentações, documentos, atendimentos e clientes.",
  applicationName: "Monteiro",
  authors: [{ name: "Processo" }],
  keywords: [
    "jurídico",
    "processo",
    "advocacia",
    "gestão jurídica",
    "escritório de advocacia",
    "Monteiro",
    "sociedade de advogados",
  ],
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    type: "website",
    siteName: "Monteiro",
    title: "Monteiro — Sociedade de Advogados",
    description:
      "Plataforma para gestão de processos, movimentações, documentos e atendimentos.",
    locale: "pt_BR",
    url: baseUrl,
  },
  twitter: {
    card: "summary",
    title: "Monteiro — Sociedade de Advogados",
    description:
      "Plataforma para gestão de processos, movimentações, documentos e atendimentos.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1f33",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${sourceSerif4.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-mist font-sans text-ink">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
};

export default RootLayout;
