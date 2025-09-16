"use client";

import React, { Suspense, useMemo, useRef, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import supabase from "@/lib/supabaseClient";

function IndiaModel({ onModelClick }) {
  const gltf = useGLTF("/models/india.glb");
  return (
    <group onClick={onModelClick}>
      <primitive object={gltf.scene} />
    </group>
  );
}

export default function AdminMap() {
  const [isOpen, setIsOpen] = useState(false);
  const [languages, setLanguages] = useState([]);

  const handleModelClick = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("languages")
        .select("id, name")
        .order("id", { ascending: true });
      if (error) throw error;
      setLanguages(data || []);
    } catch (e) {
      console.error("Failed to fetch languages", e);
      setLanguages([]);
    } finally {
      setIsOpen(true);
    }
  }, []);

  function CameraHud() {
    const camera = useThree((s) => s.camera);
    const controls = useThree((s) => s.controls);
    const [pos, setPos] = useState([0, 0, 0]);
    const [target, setTarget] = useState([0, 0, 0]);
    useFrame(() => {
      const p = camera.position;
      setPos([Number(p.x.toFixed(3)), Number(p.y.toFixed(3)), Number(p.z.toFixed(3))]);
      const t = controls?.target || { x: 0, y: 0, z: 0 };
      setTarget([Number(t.x?.toFixed?.(3) || 0), Number(t.y?.toFixed?.(3) || 0), Number(t.z?.toFixed?.(3) || 0)]);
    });
    return (
      <Html prepend style={{ pointerEvents: "none" }}>
        <div style={{
          position: "fixed",
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
      </Html>
    );
  }

  return (
    <div style={{ width: "100%", height: "70vh", background: "#0b0b0b", borderRadius: 12, position: "relative" }}>
      <Canvas camera={{ position: [-7.739, 3.998, 11.768], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <IndiaModel onModelClick={handleModelClick} />
        </Suspense>
        <OrbitControls enableDamping makeDefault target={[0.137, -0.0663, 0.419]} />
      </Canvas>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsOpen(false)}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "min(92vw, 520px)",
              background: "#faf7f1",
              border: "1px solid #e5dfd2",
              boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
              borderRadius: 10,
              transform: "rotate(-0.8deg)",
              padding: "24px 20px 18px 20px",
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0, rgba(0,0,0,0.02) 1px, transparent 1px, transparent 24px)",
            }}
          >
            {/* Pin */}
            <div
              style={{
                position: "absolute",
                top: -10,
                left: "50%",
                transform: "translateX(-50%)",
                width: 18,
                height: 18,
                background: "#e63946",
                borderRadius: "50%",
                boxShadow: "0 6px 0 rgba(0,0,0,0.2)",
                border: "2px solid #fff",
              }}
            />

            <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#222" }}>
              <h3 style={{
                margin: 0,
                fontSize: 22,
                letterSpacing: 0.3,
                borderBottom: "2px solid #e8e1d7",
                paddingBottom: 10,
              }}>
                Languages Ledger
              </h3>
              <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 14,
                    lineHeight: 1.5,
                    borderLeft: "3px solid #d0c6b8",
                    paddingLeft: 10,
                  }}>
                    {(languages && languages.length > 0) ? (
                      <div>
                        {languages.map((l) => (
                          <div key={l.id} style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 10px",
                            borderBottom: "1px dashed #dccfbd",
                            background: "#fbf8f2",
                            marginBottom: 6,
                          }}>
                            <span style={{ fontWeight: 600 }}>{l.name}</span>
                            <span style={{ fontSize: 12, color: "#8a806f" }}>ID #{l.id}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ margin: 0, color: "#6b6253" }}>No languages found.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              style={{
                position: "absolute",
                top: 8,
                right: 10,
                background: "transparent",
                border: "none",
                fontSize: 20,
                cursor: "pointer",
                color: "#6b6b6b",
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

useGLTF.preload("/models/india.glb");


