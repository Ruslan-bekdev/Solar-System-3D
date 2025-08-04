import React, {useRef} from "react";
import {useTexture} from "@react-three/drei";
import * as THREE from "three";
import {useFrame} from "@react-three/fiber";
import {ROTATION_SPEED} from "../Planets.jsx";

const Clouds = ({clouds}) => {
	const {texture, speedMultiply, scale, opacity} = clouds;
	const basePath = import.meta.env.BASE_URL;
	const cloudsTexture = useTexture(basePath + texture.replace(/^\//, ''));
	const cloudRef = useRef();
	const rotationSpeed = ROTATION_SPEED * speedMultiply

	useFrame(() => {
		if (cloudRef.current) {
			cloudRef.current.rotation.y += rotationSpeed;
		}
	});


	return (
		<mesh ref={cloudRef} scale={scale}>
			<sphereGeometry args={[1, 32, 32]} />
			<meshStandardMaterial
				map={cloudsTexture}
				transparent={true}
				opacity={opacity}
				depthWrite={false}
				side={THREE.DoubleSide}
			/>
		</mesh>
	);
};

export default Clouds;