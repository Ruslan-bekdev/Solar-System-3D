import React, {useEffect, useRef} from "react";
import {useTexture} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import planetsConfig from "../configs/planets.json";
import PlanetRings from "./PlanetRings.jsx";

const Planet = ({planet, refCallback, shadows}) => {
  const meshRef = useRef();
  const texture = useTexture(planet.texture);

  useFrame(() => {
    if (!meshRef.current) return;

    meshRef.current.rotation.y += 0.01;

    const now = Date.now() / 10000;
    const angle = (now * planet.speed * 2 * Math.PI) % (2 * Math.PI);
    const x = Math.cos(angle) * planet.distance;
    const z = Math.sin(angle) * planet.distance;

    meshRef.current.position.set(x, 0, z);});

  useEffect(() => {
    if (refCallback && meshRef.current) {
      refCallback(meshRef.current);}
  }, [refCallback]);

  return (
      <mesh
          ref={meshRef}
          castShadow={shadows}
          receiveShadow={shadows}
          scale={[planet.radius, planet.radius, planet.radius]}
      >
        <sphereGeometry args={[1, 32, 32]}/>
        <meshStandardMaterial
            map={texture}
            color={planet.color}
            roughness={0.8}
            metalness={0.1}
        />

        {planet.ring?.enabled && <PlanetRings ring={planet.ring}/>}
      </mesh>
  );
};

const RenderPlanets = ({planetRefs, shadows}) => (
    <>
      {planetsConfig.map((planet) => (
          <Planet
              key={planet.name}
              planet={planet}
              shadows={shadows}
              refCallback={(mesh) => {
                planetRefs.current[planet.name] = {current: mesh};}}
          />
      ))}
    </>
);

export default RenderPlanets;
