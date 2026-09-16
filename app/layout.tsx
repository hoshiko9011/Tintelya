import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tintelya",
  description: "Create beautiful website color palettes with Tintelya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}