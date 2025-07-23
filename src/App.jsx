import './App.less';
import React from "react";
import {Canvas} from "@react-three/fiber";
import {OrbitControls, Stars, useTexture} from "@react-three/drei";

const Sun = () => {
    const texture = useTexture("/textures/sun.jpg");

    return(
        <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 32]}/>
        <meshStandardMaterial
            map={texture}
            emissive="yellow"
            emissiveMap={texture}
            emissiveIntensity={5}
            roughness={0.2}
            metalness={0.5}
        />
        </mesh>
    )
};

const Planet = ({planet}) => {
    const texture = useTexture(planet.texture);

    return (
        <mesh position={planet.position} castShadow={true} receiveShadow={true}>
            <sphereGeometry args={[planet.radius, 32, 32]}/>
            <meshStandardMaterial
                map={texture}
                color={planet.color}
                roughness={0.8}
                metalness={0.1}
            />
        </mesh>
    );
}

const planetsConfig = [
    {
        name: "Mercury",
        texture: "/textures/mercury.jpg",
        radius: 0.38,
        position: [10, 0.5, -1],
        color: "#aaa9ad",
    },
    {
        name: "Venus",
        texture: "/textures/venus.jpg",
        radius: 0.95,
        position: [20, -1, 42],
        color: "#c2b280",
    },
    {
        name: "Earth",
        texture: "/textures/earth.jpg",
        radius: 1,
        position: [32, 1.5, 3],
        color: "#2e6fce",
    },
    {
        name: "Mars",
        texture: "/textures/mars.jpg",
        radius: 0.53,
        position: [45, -0.5, -2],
        color: "#b44b32",
    },
    {
        name: "Jupiter",
        texture: "/textures/jupiter.jpg",
        radius: 11.2 / 2,
        position: [65, 2, 5],
        color: "#d2b48c",
    },
    {
        name: "Saturn",
        texture: "/textures/saturn.jpg",
        radius: 9.45 / 2,
        position: [90, -2, -4],
        color: "#f4e2c2",
    },
    {
        name: "Uranus",
        texture: "/textures/uranus.jpg",
        radius: 4 / 2,
        position: [120, 1, 3],
        color: "#b0e0e6",
    },
    {
        name: "Neptune",
        texture: "/textures/neptune.jpg",
        radius: 3.88 / 2,
        position: [150, 0, -2],
        color: "#4169e1",
    }
];

const PlanetList = () => (
    <>
        {planetsConfig.map((planet, i) => (
            <Planet key={planet.name || i} planet={planet} />
        ))}
    </>
);


const App = () => {
    return (
        <Canvas
            camera={{position: [30, 15, 30], fov: 60}}
            shadows
        >
            <ambientLight intensity={0.05} />

            <pointLight
                position={[0, 0, 0]}
                intensity={5000}
                distance={1000}
                decay={2}
                castShadow={true}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />

            <Sun/>

            <PlanetList/>

            <Stars radius={100} depth={50} count={5000} factor={4} fade/>
            <OrbitControls/>
        </Canvas>
    );
};

export default App;