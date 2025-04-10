import React from 'react';
import Cabecera from './components/Cabecera';
import ContadorRegresivo from './components/ContadorRegresivo';
import Escena from './components/EsferasRedes';
import FondoEstelar from './components/Background/FondoEstelar';
import { Analytics } from '@vercel/analytics/react';
import './styles/global.css';

export default function App() {
  return (
    <div className="aplicacion">
      <FondoEstelar />
      <Cabecera />
      <main className="contenido-principal">
        <ContadorRegresivo fechaLanzamiento="2025-04-18T00:00:00" />
        <Escena />  
      </main>
      <Analytics />
    </div>
  );
}