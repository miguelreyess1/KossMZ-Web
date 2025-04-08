import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

function EsferaRedes({ url, posicion }) {
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

  useFrame(() => {
    if (!groupRef.current) return;
    if (!isDragging.current) {
      groupRef.current.rotation.y += velocityRef.current.vx;
      groupRef.current.rotation.x += velocityRef.current.vy;
      velocityRef.current.vx *= friction;
      velocityRef.current.vy *= friction;
      groupRef.current.rotation.y += idleRotation;
    }
  });

  return (
    <group ref={groupRef} position={posicion}>
      <mesh
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
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
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={1.2} />
      <directionalLight intensity={1.5} position={[2, 2, 2]} />
      <EsferaRedes url="/spotify.glb" posicion={[-1.5, 0, 0]} />
      <EsferaRedes url="/youtube.glb" posicion={[1.5, 0, 0]} />
    </Canvas>
  );
}

export default Escena;