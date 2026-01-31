import Nav from '@/src/components/nav';
import './globals.css';
import { AuthProvider } from '@/src/providers/AuthProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <AuthProvider>
          <Nav />
          {children}
        </AuthProvider>
        </body>
    </html>
  )
}