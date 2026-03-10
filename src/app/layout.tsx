import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScrolling } from "@/components/smooth-scrolling";
import "./globals.css";

// Load a premium, clean sans-serif font
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// Defines the browser tab name and SEO descriptions
export const metadata: Metadata = {
  title: "Noxu | The Inner Circle",
  description: "Discover exclusive vibes and connect with people nearby.",
  icons: {
    icon: "/favicon.ico", // Add your logo here later
  },
};

// Crucial for mobile-first web apps to feel like native apps
export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents the UI from zooming in when typing a chat message
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // Enforcing Noxu's premium dark mode
          enableSystem={false}
          disableTransitionOnChange
        >
          <SmoothScrolling>
            {children}
          </SmoothScrolling>
        </ThemeProvider>
      </body>
    </html>
  );
}