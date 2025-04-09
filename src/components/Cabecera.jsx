import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

function Portada() {
  const { scene } = useGLTF("/portada.glb");
  const groupRef = useRef();
  const isDragging = useRef(false);
  const prevPointer = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ vx: 0, vy: 0 });

  // Parámetros ajustados para mejor inercia
  const rotationFactor = 0.005; // Aumentado para más sensibilidad
  const friction = 0.96; // Reducido para más deslizamiento
  const minVelocity = 0.0001; // Velocidad mínima para detener

  // Ajustes iniciales del modelo
  scene.scale.set(0.6, 0.6, 0.6);
  scene.rotation.set(0, Math.PI, 0);

  // Manejadores de eventos
  const handlePointerDown = (e) => {
    isDragging.current = true;
    prevPointer.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = { vx: 0, vy: 0 }; // Resetear velocidad al comenzar nuevo arrastre
    e.stopPropagation();
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current || !groupRef.current) return;
    
    const deltaX = e.clientX - prevPointer.current.x;
    const deltaY = e.clientY - prevPointer.current.y;
    prevPointer.current = { x: e.clientX, y: e.clientY };

    // Actualizar velocidad con suavizado
    velocityRef.current.vx = deltaX * rotationFactor * 0.5 + velocityRef.current.vx * 0.5;
    velocityRef.current.vy = deltaY * rotationFactor * 0.5 + velocityRef.current.vy * 0.5;

    groupRef.current.rotation.y += deltaX * rotationFactor;
    groupRef.current.rotation.x += deltaY * rotationFactor;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  // Animación mejorada
  useFrame(() => {
    if (!groupRef.current || isDragging.current) return;
    
    // Aplicar velocidad
    groupRef.current.rotation.y += velocityRef.current.vx;
    groupRef.current.rotation.x += velocityRef.current.vy;
    
    // Aplicar fricción con detección de parada
    velocityRef.current.vx *= friction;
    velocityRef.current.vy *= friction;
    
    // Detener completamente cuando la velocidad sea muy baja
    if (Math.abs(velocityRef.current.vx) < minVelocity) velocityRef.current.vx = 0;
    if (Math.abs(velocityRef.current.vy) < minVelocity) velocityRef.current.vy = 0;
  });

  return (
    <group ref={groupRef}>
      <mesh
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
      >
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <primitive object={scene} />
    </group>
  );
}

export default function Cabecera() {
  return (
    <header className="cabecera">
      <div className="logo">
        <img src="./logo.png" alt="logo" />
      </div>
      <div className="portada" style={{ width: "300px", height: "200px", margin: "0 auto" }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={6} />
          <pointLight position={[5, 5, 5]} intensity={1.5} />
          <Portada />
        </Canvas>
      </div>
    </header>
  );
}