import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function BallModel() {
  const { scene } = useGLTF('/spotify.glb');
  const modelRef = useRef();

  useEffect(() => {
    if (modelRef.current) {
        const grados = 275;
        const radianes = grados * (Math.PI / 180);
        modelRef.current.rotation.set(0, radianes, 0);

            }
  }, [scene]);



//   useFrame(() => {
//     if (modelRef.current) {
//       modelRef.current.rotation.y += 0.01;
//     }
//   });

  return <primitive ref={modelRef} object={scene} />;
}

function Bolas() {
  return (
    <div className="social-balls">
      <Canvas style={{ width: '200px', height: '200px' }} camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={1.2} />
        <directionalLight intensity={1.5} position={[2, 2, 2]} />
        <OrbitControls enableZoom={false} enablePan={false} />
        <BallModel />
      </Canvas>
    </div>
  );
}

export default Bolas;
