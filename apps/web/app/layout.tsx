import { AuthObserver } from "@components/AuthObserver";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <AuthObserver />
      <body className="h-full">{children}</body>
    </html>
  );
}
