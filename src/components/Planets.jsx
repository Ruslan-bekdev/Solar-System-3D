import React, {useEffect, useRef} from "react";
import {useTexture} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import planetsConfig from "../configs/planets.json";
import Rings from "./features/Rings.jsx";
import Trail from "./features/Trail.jsx";
import GlowingAura from "./features/GlowingAura.jsx";
import Atmosphere from "./features/Atmosphere.jsx";
import Satellite from "./features/Satellite.jsx";
import CAMERA_MODES from "../configs/cameraModes.js";

export const ROTATION_SPEED = 0.01

const Planet = ({planet, refCallback, shadows, initialAngle = 0, focusRefName, cameraMode}) => {
	const meshRef = useRef();
	const basePath = import.meta.env.BASE_URL;
	const texture = useTexture(basePath + planet.texture.replace(/^\//, ''));
	const isFocused = focusRefName === planet.name && cameraMode === CAMERA_MODES.FOCUS;

	useEffect(() => {
		if (refCallback && meshRef.current) {
			refCallback(meshRef.current);}
	}, [refCallback]);

	useFrame(() => {
		if (!meshRef.current) return;

		const now = Date.now() / 10000;
		const angle = ((now * planet.speed * 2 * Math.PI) + initialAngle) % (2 * Math.PI);
		const x = Math.cos(angle) * planet.distance;
		const z = Math.sin(angle) * planet.distance;

		meshRef.current.position.set(x, 0, z);

		// features
		if (isFocused){
			if (planet.features?.retrograde) {
				meshRef.current.rotation.y -= ROTATION_SPEED;
			} else {
				meshRef.current.rotation.y += ROTATION_SPEED;
			}

			if (planet.features?.fastRotation) {
				meshRef.current.rotation.y += ROTATION_SPEED * planet.features.fastRotation;
			}
		}
	});


	return (
		<group>
			<mesh
				ref={meshRef}
				castShadow={shadows}
				receiveShadow={shadows}
				scale={[planet.radius, planet.radius, planet.radius]}
			>
				<sphereGeometry args={[1, 32, 32]} />
				<meshStandardMaterial
					map={texture}
					color={planet.color}
					roughness={0.8}
					metalness={0.1}
				/>

				{planet.features?.ring &&(
					<Rings ring={planet.features.ring}/>
				)}
				{planet.features?.glowingAura &&(
					<GlowingAura
						glowingAura={planet.features.glowingAura}
						planetRadius={planet.radius}
						isFocused={isFocused}
					/>
				)}
				{planet.features?.atmosphere &&(
					<Atmosphere
						atmosphere={planet.features.atmosphere}
						isFocused={isFocused}
					/>
				)}
			</mesh>

			{planet.features?.trail &&(
				<Trail
					trail={planet.features.trail}
					meshRef={meshRef}
					isFocused={isFocused}
				/>
			)}

			{planet.features?.satellite &&(
				<Satellite
					satellite={planet.features.satellite}
					planetRadius={planet.radius}
					planetRef={meshRef}
					isFocused={isFocused}
				/>
			)}
		</group>
	);
};

const RenderPlanets = ({planetRefs, shadows, focusRefName, cameraMode}) => (
	<>
		{planetsConfig.map((planet, i) => (
			<Planet
				key={planet.name}
				planet={planet}
				shadows={shadows}
				initialAngle={(i/planetsConfig.length) * 2 * Math.PI}
				refCallback={(mesh) => {
					planetRefs.current[planet.name] = {current: mesh};
				}}
				focusRefName={focusRefName}
				cameraMode={cameraMode}
			/>
		))}
	</>
);

export default RenderPlanets;
