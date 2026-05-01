export const metadata = {
  title: 'V1 System',
  description: 'Core System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'sans-serif', backgroundColor: '#0f172a', color: 'white' }}>
        {children}
      </body>
    </html>
  )
}
