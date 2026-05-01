export default function NotFound() {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <h1 style={{ fontSize: '5rem', margin: 0 }}>404</h1>
      <p>Page Not Found</p>
      <a href="/" style={{ color: '#38bdf8', textDecoration: 'none', marginTop: '20px' }}>Back to Home</a>
    </div>
  )
}
