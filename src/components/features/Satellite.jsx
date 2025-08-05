import React, {useMemo, useRef} from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";

const Satellite = ({
	                   satellite,
	                   planetRadius,
	                   planetRef,
	                   angleOffset,
	                   radiusOffset,
	                   orbitInclinationDeg,
	                   reverseOrbit,
	                   speed,
	                   isFocused
                   }) => {
	const {radiusMultiply, scaleMultiply, glow} = satellite;
	const satelliteRef = useRef();

	const orbitInclinationRad = THREE.MathUtils.degToRad(orbitInclinationDeg);

	useFrame(({clock}) => {
		if (!satelliteRef.current || !planetRef.current || !isFocused) return;

		const time = clock.getElapsedTime();
		const baseRadius = planetRadius * radiusMultiply + radiusOffset;
		const speedScale = 1.5;

		const speedAdjusted = speedScale / Math.sqrt(baseRadius);
		const angle = reverseOrbit * (time * speed * speedAdjusted + angleOffset);

		const pos = new THREE.Vector3(
			Math.cos(angle) * baseRadius,
			0,
			Math.sin(angle) * baseRadius
		);

		const rotationMatrix = new THREE.Matrix4().makeRotationX(orbitInclinationRad);
		pos.applyMatrix4(rotationMatrix);
		pos.add(planetRef.current.position);

		satelliteRef.current.position.copy(pos);
		satelliteRef.current.rotation.y += 0.02;
	});

	return (
		<group
			ref={satelliteRef}
			scale={[scaleMultiply, scaleMultiply, scaleMultiply]}
			visible={isFocused}
		>
			<mesh>
				<cylinderGeometry args={[0.05, 0.05, 0.2, 16]} />
				<meshStandardMaterial color="gray" />
			</mesh>

			<mesh position={[-0.15, 0, 0]}>
				<boxGeometry args={[0.02, 0.1, 0.4]} />
				<meshStandardMaterial color="blue" />
			</mesh>

			<mesh position={[0.15, 0, 0]}>
				<boxGeometry args={[0.02, 0.1, 0.4]} />
				<meshStandardMaterial color="blue" />
			</mesh>

			<mesh position={[0, 0.15, 0]}>
				<cylinderGeometry args={[0.005, 0.005, 0.1, 8]} />
				<meshStandardMaterial color="black" />
			</mesh>

			{glow && (
				<pointLight
					intensity={glow.intensity}
					distance={glow.distance}
					color={glow.color}
				/>
			)}
		</group>
	);
};

const RenderSatellite = ({satellite, planetRadius, planetRef, isFocused}) => {
	const satelliteParams = useMemo(() => {
		return Array.from({ length: satellite.count }).map((_, i) => {
			return {
				angleOffset: (2 * Math.PI * i) / satellite.count,
				radiusOffset: (Math.random() - 0.5) * 0.2,
				orbitInclinationDeg: (Math.random() - 0.5) * 60,
				reverseOrbit: Math.random() > 0.5 ? 1 : -1,
				speed: satellite.speed * (0.8 + Math.random() * 0.4),
			};
		});
	}, []);

	return (
		<>
			{satelliteParams.map((params, i) => (
				<Satellite
					key={i}
					satellite={satellite}
					planetRadius={planetRadius}
					planetRef={planetRef}
					{...params}
					isFocused={isFocused}
				/>
			))}
		</>
	);
};

export default RenderSatellite;
