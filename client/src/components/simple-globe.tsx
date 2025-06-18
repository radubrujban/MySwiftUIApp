import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { useRef, useState } from "react";
import { Mesh } from "three";

function Earth() {
  const meshRef = useRef<Mesh>(null);

  return (
    <Sphere ref={meshRef} args={[2, 32, 32]} position={[0, 0, 0]}>
      <meshPhongMaterial 
        color="#4a90e2"
        transparent
        opacity={0.8}
        wireframe={false}
      />
    </Sphere>
  );
}

function Scene({ autoRotate }: { autoRotate: boolean }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Earth />
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        autoRotate={autoRotate}
        autoRotateSpeed={0.5}
        minDistance={3}
        maxDistance={10}
      />
    </>
  );
}

interface SimpleGlobeProps {
  flightLegs?: any[];
  showControls?: boolean;
  autoRotate?: boolean;
  className?: string;
}

export default function SimpleGlobe({ 
  flightLegs = [], 
  showControls = true, 
  autoRotate = true, 
  className = "" 
}: SimpleGlobeProps) {
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-900 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <div className="text-blue-400 mb-2">🌍</div>
          <p className="text-white text-sm">3D Globe</p>
          <p className="text-gray-400 text-xs">Interactive view</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        onError={(error) => {
          console.error("WebGL Error:", error);
          setError("WebGL not supported");
        }}
      >
        <Scene autoRotate={autoRotate} />
      </Canvas>
      
      {/* Overlay controls */}
      {showControls && (
        <div className="absolute top-4 right-4 text-white text-xs bg-black bg-opacity-50 p-2 rounded">
          <p>🖱️ Drag to rotate</p>
          <p>🔍 Scroll to zoom</p>
          {flightLegs.length > 0 && (
            <p>✈️ {flightLegs.length} flights</p>
          )}
        </div>
      )}
    </div>
  );
}