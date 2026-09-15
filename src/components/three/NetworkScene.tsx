"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Line, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const NODE_COUNT = 9;

function useNodePositions(count: number) {
  return useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const radius = 3.1;
      positions.push([
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi) * 0.75,
        radius * Math.cos(phi),
      ]);
    }
    return positions;
  }, [count]);
}

function Core() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.12;
      meshRef.current.rotation.x += delta * 0.04;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshStandardMaterial
        color="#2f5ff0"
        wireframe
        transparent
        opacity={0.55}
        emissive="#1fb8d4"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

function Nodes() {
  const positions = useNodePositions(NODE_COUNT);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <group key={i}>
          <Line
            points={[
              [0, 0, 0],
              pos,
            ]}
            color="#4fd3e6"
            transparent
            opacity={0.18}
            lineWidth={1}
          />
          <Float
            speed={1.4 + (i % 3) * 0.3}
            rotationIntensity={0.4}
            floatIntensity={1.1}
            position={pos}
          >
            <mesh>
              <sphereGeometry args={[i % 2 === 0 ? 0.14 : 0.09, 16, 16]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? "#4fd3e6" : "#85adff"}
                emissive={i % 2 === 0 ? "#1fb8d4" : "#2f5ff0"}
                emissiveIntensity={0.6}
              />
            </mesh>
          </Float>
        </group>
      ))}
    </group>
  );
}

function PointerRig({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    const targetX = (state.pointer.x * viewport.width) / 40;
    const targetY = (state.pointer.y * viewport.height) / 40;
    groupRef.current.rotation.y +=
      (targetX - groupRef.current.rotation.y) * 0.03;
    groupRef.current.rotation.x +=
      (-targetY - groupRef.current.rotation.x) * 0.03;
  });

  return <group ref={groupRef}>{children}</group>;
}

export function NetworkScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={40} color="#4fd3e6" />
      <pointLight position={[-5, -3, -5]} intensity={20} color="#2f5ff0" />
      <PointerRig>
        <Core />
        <Nodes />
      </PointerRig>
      <Sparkles count={60} scale={9} size={2} speed={0.25} color="#8ce8f4" />
    </Canvas>
  );
}
