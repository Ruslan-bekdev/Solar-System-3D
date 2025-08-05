import React, {useRef} from "react";
import * as THREE from "three";
import {useFrame} from "@react-three/fiber";

const GlowingAura = ({glowingAura, planetRadius, isFocused}) => {
	const {color, scale, pulseSpeed, isAuraHide, auraPulseScale, auraOpacity} = glowingAura;
	const glowRef = useRef();
	const baseScale = planetRadius * scale;

	useFrame(({clock}) => {
		if (!glowRef.current || !isFocused) return;
		const time = clock.getElapsedTime();
		const scalePulse = isAuraHide ?0.9 :1 + auraPulseScale * Math.sin(time * pulseSpeed);

		glowRef.current.material.opacity = auraOpacity.base + auraOpacity.pulse * Math.sin(time * pulseSpeed);
		glowRef.current.scale.set(
			baseScale * scalePulse,
			baseScale * scalePulse,
			baseScale * scalePulse
		);
	});

	return (
		<mesh
			ref={glowRef}
			scale={[baseScale]}
		>
			<sphereGeometry args={[1, 32, 32]} />
			<meshBasicMaterial
				color={color}
				transparent={true}
				opacity={auraOpacity.base}
				depthWrite={false}
				blending={THREE.AdditiveBlending}
			/>
		</mesh>
	);
};

export default GlowingAura;