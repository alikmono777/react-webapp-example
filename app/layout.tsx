import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Link from "next/link";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Telegram Bot Builder Webapp",
  description: "Build your own Telegram bot with ease using our webapp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script src="https://telegram.org/js/telegram-web-app.js" />
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center gap-2 p-2 md:p-10 lg:p-24 central-block">
          <img
            src="./img/sombralong.png"
            alt="Sombra Batumi"
            className="w-full max-w-md rounded-xl"
          />
          <div className="flex flex-wrap gap-6 justify-center mt-6">

            <Link
              href={`/places/`}
              className="flex-1 text-center py-2 px-4 rounded-xl border border-[#f5c26b] text-[#f5c26b] hover:bg-[#f5c26b]/10"
            >
              Заведения
            </Link>
            <Link
              href={`/coworkers/`}
              className="flex-1 text-center py-2 px-4 rounded-xl border border-[#f5c26b] text-[#f5c26b] hover:bg-[#f5c26b]/10"
            >
              Сотрудники
            </Link>
          </div>

          {children}

        </main>
      </body>
    </html>
  );
}
