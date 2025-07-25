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
function SpinningModel({ setCameraLog }) {
  const groupRef = useRef();
  const { scene } = useGLTF("/models/logo.glb");

  const controlsRef = useRef();
  const { camera, gl } = useThree();
  const isInteracting = useRef(false);

  useFrame(() => {
    const pos = camera.position;
    const tgt = controlsRef.current?.target;

    if (setCameraLog && tgt) {
      setCameraLog(
        `Camera: [${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}]\nTarget: [${tgt.x.toFixed(2)}, ${tgt.y.toFixed(2)}, ${tgt.z.toFixed(2)}]`
      );
    }

    if (!isInteracting.current && groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <>
      <group ref={groupRef}>
        <primitive
          object={scene}
          position={[-22.25, 0, 0]}
          scale={[1.5, 1.5, 1.5]}
          castShadow
        />
      </group>
      <OrbitControls
        ref={controlsRef}
        args={[camera, gl.domElement]}
        enableZoom={true}
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
  const [cameraLog, setCameraLog] = useState("");

  return (
    <div style={{ position: "relative", width: 500, height: 500 }}>
      <Canvas
        shadows
        camera={{ position: [-1.24, 1.31, 9.54], fov: 10 }}
        gl={{ physicallyCorrectLights: true }}
      >
        {/* Three-point light setup */}
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <ambientLight intensity={0.4} />
        <spotLight
          position={[-10, 15, 10]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <pointLight position={[0, 5, -10]} intensity={0.4} />

        {/* 3D Model */}
        <Suspense fallback={null}>
          <SpinningModel setCameraLog={setCameraLog} />
        </Suspense>

        {/* Contact shadows under model */}
        <ContactShadows
          position={[0, -0.8, 0]}
          opacity={0.5}
          scale={50}
          blur={1.5}
          far={10}
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
