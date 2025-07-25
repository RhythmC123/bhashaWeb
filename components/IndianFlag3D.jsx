// components/IndianFlag3D.jsx
import React, { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";

function FlagModel() {
  const ref = useRef();
  const { scene } = useGLTF("/models/india_flag.glb");

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.003; // subtle slow spin
    }
  });

  return <primitive object={scene} ref={ref} scale={[0.35, 0.35, 0.35]} />;
}

export default function IndianFlag3D() {
  return (
    <div className="w-full h-[400px]">
      <Canvas camera={{ position: [0, 5, 10], fov: 55 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 5, 2]} intensity={1.2} />
        <Suspense fallback={null}>
          <FlagModel />
          <Environment preset="sunset" />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={1.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}
