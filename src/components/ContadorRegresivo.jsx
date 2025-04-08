import React, { useState, useEffect } from 'react';

export default function ContadorRegresivo({ fechaLanzamiento }) {
  const [tiempoRestante, setTiempoRestante] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0
  });

  useEffect(() => {
    const actualizarTiempo = () => {
      const diferencia = new Date(fechaLanzamiento) - new Date();
      
      if (diferencia > 0) {
        setTiempoRestante({
          dias: Math.floor(diferencia / (1000 * 60 * 60 * 24)),
          horas: Math.floor((diferencia / (1000 * 60 * 60)) % 24),
          minutos: Math.floor((diferencia / 1000 / 60) % 60),
          segundos: Math.floor((diferencia / 1000) % 60)
        });
      }
    };

    const intervalo = setInterval(actualizarTiempo, 1000);
    actualizarTiempo();
    
    return () => clearInterval(intervalo);
  }, [fechaLanzamiento]);

  return (
    <div className="contador-regresivo">
      <div className="tiempo-segmento">
        <span className="tiempo-numero">{tiempoRestante.dias}</span>
        <span className="tiempo-etiqueta">Días</span>
      </div>
      <div className="tiempo-segmento">
        <span className="tiempo-numero">{tiempoRestante.horas}</span>
        <span className="tiempo-etiqueta">Horas</span>
      </div>
      <div className="tiempo-segmento">
        <span className="tiempo-numero">{tiempoRestante.minutos}</span>
        <span className="tiempo-etiqueta">Minutos</span>
      </div>
      <div className="tiempo-segmento">
        <span className="tiempo-numero">{tiempoRestante.segundos}</span>
        <span className="tiempo-etiqueta">Segundos</span>
      </div>
    </div>
  );
}