import Nav from '@/src/components/nav';
import './globals.css';
import { AuthProvider } from '@/src/providers/AuthProvider';
import { checkAuthServer } from './services/api/user.api.server';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await checkAuthServer();
  return (
    <html>
      <body>
        <AuthProvider initialUser={user}>
          <Nav />
          {children}
        </AuthProvider>
        </body>
    </html>
  )
}