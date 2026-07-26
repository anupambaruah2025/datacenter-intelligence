'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * A slowly rotating, gently distorting icosahedron with a glassy iridescent
 * material — the hero's 3D centrepiece. It responds subtly to the pointer.
 */
function MorphObject(props: ThreeElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null);
  const reduced = usePrefersReducedMotion();

  useFrame((state, delta) => {
    if (!ref.current) return;
    if (!reduced) {
      ref.current.rotation.y += delta * 0.18;
      ref.current.rotation.x += delta * 0.06;
    }
    // Ease toward the pointer for a subtle "looking at you" parallax.
    const targetX = state.pointer.y * 0.25;
    const targetY = state.pointer.x * 0.35;
    ref.current.rotation.x += (targetX - ref.current.rotation.x * 0.02) * 0.02;
    ref.current.rotation.z += (targetY - ref.current.rotation.z) * 0.02;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
  });

  return (
    <mesh ref={ref} {...props}>
      <icosahedronGeometry args={[1.35, 8]} />
      <MeshDistortMaterial
        color="#8b5cf6"
        emissive="#4c1d95"
        emissiveIntensity={0.35}
        roughness={0.15}
        metalness={0.85}
        distort={reduced ? 0 : 0.35}
        speed={1.6}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
}

/** A drifting field of points that surrounds the hero object. */
function Particles({ count = 900 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const reduced = usePrefersReducedMotion();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute in a spherical shell for depth.
      const r = 3 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current && !reduced) {
      ref.current.rotation.y += delta * 0.02;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        sizeAttenuation
        color="#a5b4fc"
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * The full hero canvas. Rendered client-side only (imported with ssr:false) and
 * kept lightweight: capped DPR, fewer particles on mobile, and it pauses work
 * when reduced-motion is set. Lighting is code-only (no external HDR fetch).
 */
export default function HeroScene() {
  const isMobile = useIsMobile();

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, isMobile ? 1.5 : 2]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.4} color="#c4b5fd" />
      <pointLight position={[-6, -3, -4]} intensity={2.4} color="#22d3ee" />
      <pointLight position={[6, 3, 2]} intensity={1.6} color="#f472b6" />

      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
        <MorphObject />
      </Float>

      <Particles count={isMobile ? 450 : 900} />
    </Canvas>
  );
}
