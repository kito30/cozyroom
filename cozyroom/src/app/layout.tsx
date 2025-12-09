import Nav from './nav';
import './globals.css';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <Nav />
        {children}
        </body>
    </html>
  )
}