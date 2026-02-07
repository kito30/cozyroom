import Nav from '@/src/components/nav';
import './globals.css';
import { AuthProvider } from '@/src/providers/AuthProvider';
import { ProfileProvider } from '@/src/providers/ProfileProvider';
import { getLayoutSession } from './services/api';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile } = await getLayoutSession();

  return (
    <html>
      <body>
        <AuthProvider initialUser={user}>
          <ProfileProvider profile={profile}>
            <Nav />
            {children}
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  )
}