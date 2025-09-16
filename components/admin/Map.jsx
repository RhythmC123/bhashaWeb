"use client";

import React, { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function IndiaModel() {
  const gltf = useGLTF("/models/india.glb");
  return <primitive object={gltf.scene} />;
}

export default function AdminMap() {
  function CameraHud() {
    const { camera, controls } = useThree();
    const [pos, setPos] = useState([0, 0, 0]);
    const [target, setTarget] = useState([0, 0, 0]);
    useFrame(() => {
      const p = camera.position;
      setPos([Number(p.x.toFixed(3)), Number(p.y.toFixed(3)), Number(p.z.toFixed(3))]);
      const t = controls?.target || { x: 0, y: 0, z: 0 };
      setTarget([Number(t.x?.toFixed?.(3) || 0), Number(t.y?.toFixed?.(3) || 0), Number(t.z?.toFixed?.(3) || 0)]);
    });
    return (
      <div style={{
        position: "absolute",
        top: 8,
        left: 8,
        padding: "6px 10px",
        background: "rgba(0,0,0,0.6)",
        color: "#fff",
        fontSize: 12,
        borderRadius: 8,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
      }}>
        <div>cam: [{pos.join(", ")}]</div>
        <div>target: [{target.join(", ")}]</div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "70vh", background: "#0b0b0b", borderRadius: 12, position: "relative" }}>
      <Canvas camera={{ position: [2.5, 2, 2.5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <IndiaModel />
        </Suspense>
        <OrbitControls enableDamping makeDefault />
      </Canvas>
      <CameraHud />
    </div>
  );
}

useGLTF.preload("/models/india.glb");


