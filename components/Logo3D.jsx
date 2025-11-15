import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  ContactShadows,
  Stage,
} from "@react-three/drei";

// Spinning 3D Logo Component
function SpinningModel() {
  const groupRef = useRef();
  const { scene } = useGLTF("/models/fff.glb");

  const controlsRef = useRef();
  const { camera, gl } = useThree();
  const isInteracting = useRef(false);

  useFrame(() => {
    if (!isInteracting.current && groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <>
      <group ref={groupRef}>
        <primitive
          object={scene}
          position={[0, 1, 0]}
          scale={[1.5, 1.5, 1.5]}
          castShadow
        />
      </group>
      <OrbitControls
        ref={controlsRef}
        args={[camera, gl.domElement]}
        enableZoom={false}
        enableRotate={true}
        enablePan={true}
        target={[0, 1, 0]}
        onStart={() => (isInteracting.current = true)}
        onEnd={() => (isInteracting.current = false)}
      />
    </>
  );
}

// Main Component
export default function Logo3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [-1.24, 1.31, 9.54], fov: 10 }}
        gl={{ physicallyCorrectLights: true }}
        className="w-full h-full"
      >
        {/* Enhanced lighting setup for better visual appeal */}
        <directionalLight
          position={[5, 10, 5]}
          intensity={2.0}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          color="#ff8c42"
        />
        <directionalLight
          position={[-5, 8, -5]}
          intensity={1.2}
          color="#ff6b35"
        />
        <ambientLight intensity={0.6} color="#fff4e6" />
        <spotLight
          position={[-10, 15, 10]}
          angle={0.4}
          penumbra={0.8}
          intensity={1.5}
          castShadow
          color="#ff9f4a"
        />
        <pointLight position={[0, 5, -10]} intensity={0.8} color="#ffa726" />
        <pointLight position={[8, 3, 8]} intensity={0.6} color="#ffb74d" />
        <hemisphereLight
          skyColor="#ff8c42"
          groundColor="#ff6b35"
          intensity={0.3}
        />

        {/* 3D Model */}
        <Suspense fallback={null}>
          <SpinningModel />
        </Suspense>

        {/* Enhanced contact shadows under model */}
        <ContactShadows
          position={[0, -0.8, 0]}
          opacity={0.6}
          scale={50}
          blur={2}
          far={10}
          color="#ff6b35"
        />
      </Canvas>

      {/* Camera log overlay */}
      {/* <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "rgba(0,0,0,0.7)",
          color: "white",
          fontSize: "12px",
          padding: "6px 8px",
          borderRadius: "6px",
          whiteSpace: "pre",
          fontFamily: "monospace",
        }}
      >
        {cameraLog}
      </div> */}
    </div>
  );
}
