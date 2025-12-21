import Nav from './nav';
import './globals.css';
import { AuthProvider } from '../providers/AuthProvider';

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