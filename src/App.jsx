import './App.less';
import React, {useRef} from 'react';
import {Canvas, useFrame} from '@react-three/fiber';
import {OrbitControls, useTexture} from '@react-three/drei';
import StarField from './StarField.jsx';

const Sun = () => {
    const texture = useTexture('/textures/sun.jpg');
    return (
        <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshStandardMaterial
                map={texture}
                emissive='yellow'
                emissiveMap={texture}
                emissiveIntensity={5}
                roughness={0.2}
                metalness={0.5}
            />
        </mesh>
    );
};

const Planet = ({planet}) => {
    const texture = useTexture(planet.texture);
    const ref = useRef();

    useFrame(() => {
        if (!ref.current) return;

        ref.current.rotation.y += 0.5 * (1/60);

        const now = Date.now() / 10000;

        const angle = (now * planet.speed * 2 * Math.PI) % (2 * Math.PI);

        const x = Math.cos(angle) * planet.distance;
        const z = Math.sin(angle) * planet.distance;
        ref.current.position.set(x, 0, z);
    });

    return (
        <mesh
            ref={ref}
            castShadow={true}
            receiveShadow={true}
            scale={[planet.radius, planet.radius, planet.radius]}
        >
            <sphereGeometry args={[1, 32, 32]}/>
            <meshStandardMaterial
                map={texture}
                color={planet.color}
                roughness={0.8}
                metalness={0.1}
            />
        </mesh>
    );
};

const planetsConfig = [
    {
        name: 'Mercury',
        texture: '/textures/mercury.jpg',
        radius: 0.2,
        distance: 5,
        speed: 0.5,
        color: '#aaa9ad',
    },
    {
        name: 'Venus',
        texture: '/textures/venus.jpg',
        radius: 0.3,
        distance: 7,
        speed: 0.4,
        color: '#c2b280',
    },
    {
        name: 'Earth',
        texture: '/textures/earth.jpg',
        radius: 0.35,
        distance: 10,
        speed: 0.3,
        color: '#2e6fce',
    },
    {
        name: 'Mars',
        texture: '/textures/mars.jpg',
        radius: 0.3,
        distance: 13,
        speed: 0.25,
        color: '#b44b32',
    },
    {
        name: 'Jupiter',
        texture: '/textures/jupiter.jpg',
        radius: 0.7,
        distance: 17,
        speed: 0.2,
        color: '#d2b48c',
    },
    {
        name: 'Saturn',
        texture: '/textures/saturn.jpg',
        radius: 0.6,
        distance: 21,
        speed: 0.18,
        color: '#f4e2c2',
    },
    {
        name: 'Uranus',
        texture: '/textures/uranus.jpg',
        radius: 0.5,
        distance: 25,
        speed: 0.15,
        color: '#b0e0e6',
    },
    {
        name: 'Neptune',
        texture: '/textures/neptune.jpg',
        radius: 0.5,
        distance: 29,
        speed: 0.13,
        color: '#4169e1',
    },
];

const PlanetList = () => (
    <>
        {planetsConfig.map((planet) => (
            <Planet key={planet.name} planet={planet} />
        ))}
    </>
);

const App = () => {
    return (
        <Canvas
            camera={{position: [30, 15, 30], fov: 60}}
            shadows
        >
            <ambientLight intensity={0.05}/>
            <pointLight
                position={[0, 0, 0]}
                intensity={1000}
                distance={200}
                decay={2}
                castShadow={true}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
            <Sun/>
            <PlanetList/>
            <StarField/>
            <OrbitControls/>
        </Canvas>
    );
};

export default App;