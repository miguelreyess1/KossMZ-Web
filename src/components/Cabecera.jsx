import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

function Portada() {
  const { scene } = useGLTF("/portada.glb");
  const groupRef = useRef();
  const isDragging = useRef(false);
  const prevPointer = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ vx: 0, vy: 0 });

  const rotationFactor = 0.005;
  const friction = 0.96;
  const minVelocity = 0.0001;

  // Configuración inicial del modelo
  scene.scale.set(0.4, 0.4, 0.4);
  scene.rotation.set(0, 4.7, 0);

  // Guardamos el valor inicial de Y para el efecto de rebote
  const initialY = useRef(0);
  useEffect(() => {
    if (groupRef.current) {
      initialY.current = groupRef.current.position.y;
    }
  }, []);

  const handlePointerDown = (e) => {
    isDragging.current = true;
    prevPointer.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = { vx: 0, vy: 0 };
    e.stopPropagation();
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current || !groupRef.current) return;

    const deltaX = e.clientX - prevPointer.current.x;
    const deltaY = e.clientY - prevPointer.current.y;
    prevPointer.current = { x: e.clientX, y: e.clientY };

    velocityRef.current.vx = deltaX * rotationFactor * 0.5 + velocityRef.current.vx * 0.5;
    velocityRef.current.vy = deltaY * rotationFactor * 0.5 + velocityRef.current.vy * 0.5;

    groupRef.current.rotation.y += deltaX * rotationFactor;
    groupRef.current.rotation.x += deltaY * rotationFactor;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  useFrame((state) => {
    if (!groupRef.current) return;

    // Rotación según la interacción de arrastre
    if (!isDragging.current) {
      groupRef.current.rotation.y += velocityRef.current.vx;
      groupRef.current.rotation.x += velocityRef.current.vy;
      velocityRef.current.vx *= friction;
      velocityRef.current.vy *= friction;

      if (Math.abs(velocityRef.current.vx) < minVelocity) velocityRef.current.vx = 0;
      if (Math.abs(velocityRef.current.vy) < minVelocity) velocityRef.current.vy = 0;
    }
    
    // Movimiento vertical tipo rebote, más lento que el de las esferas
    const time = state.clock.getElapsedTime();
    const amplitude = 0.2;  // Controla cuánto sube y baja
    const frequency = 0.5;  // Controla la velocidad del rebote
    groupRef.current.position.y = initialY.current + Math.sin(time * frequency) * amplitude;
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
    <header>
      <h2 className="titulo-cancion">PISO 9</h2>
      <h3 className="nombre-artista">KOSS MZ</h3>
      <div className="portada" style={{ width: "200px", height: "200px", margin: "0 auto" }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={4} />
          <Portada />
        </Canvas>
      </div>
    </header>
  );
}