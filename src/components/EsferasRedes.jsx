import React, { useRef } from 'react';
import { useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

function EsferaRedes({ url, posicion, enlace, rotacion }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef();

  const isDragging = useRef(false);
  const prevPointer = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ vx: 0, vy: 0 });

  const rotationFactor = 0.01;
  const friction = 0.95;
  const idleRotation = 0.001;

  const handlePointerDown = (e) => {
    isDragging.current = true;
    prevPointer.current = {
      x: e.nativeEvent.clientX,
      y: e.nativeEvent.clientY
    };
    e.stopPropagation();
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const currentX = e.nativeEvent.clientX;
    const currentY = e.nativeEvent.clientY;
    const deltaX = currentX - prevPointer.current.x;
    const deltaY = currentY - prevPointer.current.y;
    prevPointer.current = { x: currentX, y: currentY };

    velocityRef.current.vx = deltaX * rotationFactor;
    velocityRef.current.vy = deltaY * rotationFactor;

    if (groupRef.current) {
      groupRef.current.rotation.y += deltaX * rotationFactor;
      groupRef.current.rotation.x += deltaY * rotationFactor;
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handleClick = (e) => {
    // Solo redirige si no hubo arrastre (para evitar redirección accidental)
    if (!isDragging.current && enlace) {
      window.open(enlace, '_blank'); // Abre en una nueva pestaña
    }
    e.stopPropagation();
  };

  const initialRotation = useRef(rotacion || [0, 0, 0]);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.set(
        rotacion?.[0] || 0,
        rotacion?.[1] || 0,
        rotacion?.[2] || 0
      );
    }
  }, [rotacion]);  

  useFrame(() => {
    if (!groupRef.current || isDragging.current) return;
    groupRef.current.rotation.y += velocityRef.current.vx;
    groupRef.current.rotation.x += velocityRef.current.vy;
    velocityRef.current.vx *= friction;
    velocityRef.current.vy *= friction;
  });
   

  return (
    <group ref={groupRef} position={posicion}>
      <mesh
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
        onClick={handleClick} // Agregar manejador de clic
      >
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <primitive object={scene} />
    </group>
  );
}

export function Escena() {
  return (
    <div className='contenedor-esferas'>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={1.2} />
        <directionalLight intensity={1.5} position={[2, 2, 2]} />
        <EsferaRedes 
          url="/spotify.glb" 
          posicion={[-2.5, 0, 0]}
          rotacion={[0, 1, 0]} 
          enlace="https://open.spotify.com/intl-es/artist/3L38Pmccw8XRKFBUQlnjq8" 
        />
        <EsferaRedes
          url="/instagram.glb"
          posicion={[2.5, 0, 0]}
          rotacion={[0, 6, 0]}
          enlace="https://www.instagram.com/koss.mz"
        />
        <EsferaRedes 
          url="/youtube.glb" 
          posicion={[0, 0, 0]} 
          rotacion={[0, 25, 0]}
          enlace="https://www.youtube.com/@Kossmzz" 
        />
      </Canvas>
    </div>
  );
}

export default Escena;