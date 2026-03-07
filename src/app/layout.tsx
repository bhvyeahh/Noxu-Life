import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScrolling } from "@/components/smooth-scrolling";
import "./globals.css"; // Ensure your Tailwind CSS is imported!

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Added overflow-x-hidden to prevent horizontal scrolling bugs */}
      <body className="antialiased bg-background text-foreground overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
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