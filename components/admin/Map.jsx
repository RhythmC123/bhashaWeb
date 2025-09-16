"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function IndiaModel() {
  const gltf = useGLTF("/models/india.glb");
  return <primitive object={gltf.scene} />;
}

export default function AdminMap() {
  return (
    <div style={{ width: "100%", height: "70vh", background: "#0b0b0b", borderRadius: 12 }}>
      <Canvas camera={{ position: [2.5, 2, 2.5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <IndiaModel />
        </Suspense>
        <OrbitControls enableDamping makeDefault />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/india.glb");


