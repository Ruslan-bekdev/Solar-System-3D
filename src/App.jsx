import './App.less';
import React from "react";
import {Canvas} from "@react-three/fiber";
import {OrbitControls, Stars} from "@react-three/drei";

const Sun = () => (
  <mesh position={[0, 0, 0]}>
    <sphereGeometry args={[2, 32, 32]}/>
    <meshStandardMaterial
      color="yellow"
      emissive="yellow"
      emissiveIntensity={5}
      roughness={0.2}
      metalness={0.5}
    />
  </mesh>
);

const Planet = ({position}) => (
  <mesh position={position} castShadow={true} receiveShadow={true}>
    <sphereGeometry args={[1, 32, 32]} />
    <meshStandardMaterial
      color="orange"
      roughness={0.8}
      metalness={0.1}
    />
  </mesh>
);

const App = () => {
  const planetsPosition = [];
  for (let i = 0; i < 10; i++) {
    planetsPosition.push([i * 3 + 5, 0, 0]);
  }

  return (
    <Canvas
      camera={{position: [30, 15, 30], fov: 60}}
      shadows
    >

      <ambientLight intensity={0.05} />

      <pointLight
        position={[0, 0, 0]}
        intensity={150}
        distance={100}
        decay={2}
        castShadow={true}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <Sun/>

      {planetsPosition.map((position, i) => (
        <Planet key={i} position={position}/>
      ))}

      <Stars radius={100} depth={50} count={5000} factor={4} fade />
      <OrbitControls/>
    </Canvas>
  );
};

export default App;