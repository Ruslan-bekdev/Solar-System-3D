import React, {useEffect, useRef} from "react";
import * as THREE from "three";
import {useTexture} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import {Rings, Trail, GlowingAura, Atmosphere, Satellite, Glossiness} from './features';
import planetsConfig from "../configs/planets.json";
import CAMERA_MODES from "../configs/cameraModes.js";

export const ROTATION_SPEED = 0.01

const Planet = ({
	                planet,
	                refCallback,
	                shadows,
	                initialAngle = 0,
	                focusRefName,
	                cameraMode,
	                onLoaded
                }) => {
	const {texture, speed, distance, radius, color, tilt, features, name} = planet;
	const groupRef = useRef();
	const rotationGroupRef = useRef();
	const meshRef = useRef();
	const basePath = import.meta.env.BASE_URL;
	const planetTexture = useTexture(basePath + texture.replace(/^\//, ''));
	const isFocused = focusRefName === name || cameraMode === CAMERA_MODES.FREE;
	const loadedRef = useRef(false);

	useEffect(() => {
		if (refCallback && meshRef.current) {
			refCallback(meshRef.current);}
	}, [refCallback]);

	useEffect(() => {
		if (!loadedRef.current && onLoaded && planetTexture && planetTexture.image) {
			loadedRef.current = true;
			onLoaded();
		}
	}, [onLoaded, planetTexture]);


	useFrame(() => {
		if (!meshRef.current || !groupRef.current || !rotationGroupRef.current) return;

		const now = Date.now() / 10000;
		const angle = ((now * speed * 2 * Math.PI) + initialAngle) % (2 * Math.PI);
		const x = Math.cos(angle) * distance;
		const z = Math.sin(angle) * distance;
		groupRef.current.position.set(x, 0, z);

		rotationGroupRef.current.rotation.y += ROTATION_SPEED;

		if (isFocused){
			if (features?.fastRotation)
				rotationGroupRef.current.rotation.y += ROTATION_SPEED * features.fastRotation;

			if (features?.fluidLike) {
				const time = Date.now() * 0.001;
				const f = features.fluidLike;
				const wiggleA = f.wiggleAmplitude;
				const wiggleF = f.wiggleFrequency;

				meshRef.current.scale.x = radius + wiggleA * Math.sin(time * wiggleF);
				meshRef.current.scale.y = radius + wiggleA * Math.sin(time * wiggleF + Math.PI / 2);
				meshRef.current.scale.z = radius + wiggleA * Math.sin(time * wiggleF + Math.PI);

				meshRef.current.position.x = f.floatAmplitude * Math.sin(time * f.floatFrequencyX);
				meshRef.current.position.y = f.floatAmplitude * Math.cos(time * f.floatFrequencyY);
			}
		}
	});


	return (
		// орбита планеты
		<group ref={groupRef}>
			{/*наклон оси планеты*/}
			<group rotation={[0, 0, THREE.MathUtils.degToRad(tilt)]}>
				{/*вращение планеты вокруг своей оси*/}
				<group ref={rotationGroupRef}>
					<mesh
						ref={meshRef}
						castShadow={shadows}
						receiveShadow={shadows}
						scale={[radius, radius, radius]}
					>
						<sphereGeometry args={[1, 32, 32]} />
						<meshStandardMaterial
							map={planetTexture}
							color={color}
							roughness={0.8}
							metalness={0.1}
						/>

						{features?.ring &&(
							<Rings ring={features.ring}/>
						)}
						{features?.glowingAura &&(
							<GlowingAura
								glowingAura={features.glowingAura}
								planetRadius={radius}
								isFocused={isFocused}
							/>
						)}
						{features?.atmosphere &&(
							<Atmosphere
								atmosphere={features.atmosphere}
								isFocused={isFocused}
							/>
						)}
						{features?.glossiness &&(
							<Glossiness
								glossiness={features.glossiness}
								color={color}
								map={planetTexture}
							/>
						)}
					</mesh>
				</group>

				{features?.satellite &&(
					<Satellite
						satellite={features.satellite}
						planetRadius={radius}
						planetRef={meshRef}
						isFocused={isFocused}
					/>
				)}
				{features?.trail &&(
					<Trail
						trail={features.trail}
						meshRef={meshRef}
						isFocused={isFocused}
					/>
				)}
			</group>
		</group>
	);
};

const RenderPlanets = ({planetRefs, shadows, focusRefName, cameraMode, onLoaded}) => (
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
				onLoaded={onLoaded}
			/>
		))}
	</>
);

export default RenderPlanets;