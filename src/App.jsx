import React from 'react'
import Header from './components/Header'
import CuentaAtras from './components/CuentaAtras'
import Bolas from './components/Bolas'
import './index.css'

function App() {
  return (
    <div className="app-container">
      <Header />

      <section className="countdown-section">
        <CuentaAtras targetDate="2025-08-01T00:00:00" />
      </section>

      <section className="social-section">
        <Bolas />
      </section>

      <footer className="footer">
        <p>© 2025 KOSS MZ. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

export default App
