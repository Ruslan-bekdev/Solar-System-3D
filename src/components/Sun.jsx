import React, {forwardRef, useEffect, useRef} from "react";
import {useTexture} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";

const MAX_ROTATION = 0.003;
const ROTATION_NOISE = 0.0005;
const BASE_SCALE = 1;
const WIGGLE_AMPLITUDE = 0.03;
const FLOAT_AMPLITUDE = 0.04;

const Sun = forwardRef(({refCallback, shadows}, ref) => {
	const texture = useTexture(new URL("/textures/sun.jpg", import.meta.url).href);
	const localRef = useRef();
    const finalRef = ref || localRef;

    useEffect(() => {
        if (refCallback && finalRef.current) refCallback(finalRef.current);
    }, [refCallback, finalRef]);

    const rotationSpeed = useRef(new THREE.Vector3(
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.002
    ));

    useFrame(() => {
        const time = Date.now() * 0.001;

        if (finalRef.current) {
            const scaleAlt = 1 + Math.sin(time * 2) * 0.03 + Math.cos(time * 3) * 0.01;
            finalRef.current.scale.set(scaleAlt, scaleAlt, scaleAlt);

            const colorShift = 0.7 + 0.3 * Math.sin(time * 3);
            finalRef.current.material.emissive = new THREE.Color(1, 0.5 * colorShift, 0);

            rotationSpeed.current.x += (Math.random() - 0.5) * ROTATION_NOISE;
            rotationSpeed.current.y += (Math.random() - 0.5) * ROTATION_NOISE;
            rotationSpeed.current.z += (Math.random() - 0.5) * ROTATION_NOISE;
            rotationSpeed.current.x = THREE.MathUtils.clamp(rotationSpeed.current.x, -MAX_ROTATION, MAX_ROTATION);
            rotationSpeed.current.y = THREE.MathUtils.clamp(rotationSpeed.current.y, -MAX_ROTATION, MAX_ROTATION);
            rotationSpeed.current.z = THREE.MathUtils.clamp(rotationSpeed.current.z, -MAX_ROTATION, MAX_ROTATION);


            finalRef.current.rotation.x += rotationSpeed.current.x;
            finalRef.current.rotation.x += 0.001 * Math.sin(time * 8);
            finalRef.current.rotation.y += rotationSpeed.current.y;
            finalRef.current.rotation.y += 0.0015 * Math.cos(time * 10);
            finalRef.current.rotation.z += rotationSpeed.current.z;

            finalRef.current.scale.x = BASE_SCALE + WIGGLE_AMPLITUDE * Math.sin(time * 4);
            finalRef.current.scale.y = BASE_SCALE + WIGGLE_AMPLITUDE * Math.sin(time * 4 + Math.PI / 2);
            finalRef.current.scale.z = BASE_SCALE + WIGGLE_AMPLITUDE * Math.sin(time * 4 + Math.PI);

            finalRef.current.position.x = FLOAT_AMPLITUDE * Math.sin(time * 5);
            finalRef.current.position.y = FLOAT_AMPLITUDE * Math.cos(time * 4);

            finalRef.current.material.emissiveIntensity = 4 + 0.3 * Math.sin(time * 5) + 0.2 * Math.cos(time * 8);
        }
    });

    return (
        <mesh
            name={"Солнце"}
            ref={finalRef}
            castShadow={!shadows}
            receiveShadow={false}
        >
            <sphereGeometry args={[2, 64, 64]} />
            <meshStandardMaterial
                map={texture}
                emissive="yellow"
                emissiveMap={texture}
                emissiveIntensity={5}
                roughness={0.2}
                metalness={0.5}
            />
        </mesh>
    );
});

export default Sun;