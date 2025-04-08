// App.jsx
import React from 'react';
import Cabecera from './components/Cabecera';
import ContadorRegresivo from './components/ContadorRegresivo';
import Escena from './components/EsferasRedes';
import FondoEstelar from './components/Background/FondoEstelar';
import './styles/global.css';

export default function App() {
  return (
    <div className="aplicacion">
      <FondoEstelar />
      <Cabecera />
      <main className="contenido-principal">
        <ContadorRegresivo fechaLanzamiento="2025-08-01T00:00:00" />
          <Escena />  
      </main>
    </div>
  );
}