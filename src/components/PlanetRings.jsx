import React, {useMemo} from "react";
import {useTexture} from "@react-three/drei";
import * as THREE from "three";

const PlanetRings = ({ring}) => {
	const ringTexture = useTexture(ring.texture);
	const tiltRad = useMemo(
		() => THREE.MathUtils.degToRad(ring.tiltDeg - 90),
		[ring.tiltDeg]
	);
	return (
		<mesh
			rotation={[tiltRad, 0, 0]}
			renderOrder={1}
		>
			<ringGeometry
				args={[ring.innerFactor, ring.outerFactor, ring.segments ?? 128, 1]}
			/>
			<meshBasicMaterial
				map={ringTexture}
				alphaMap={ringTexture}
				transparent={true}
				opacity={ring.opacity ?? 0.9}
				side={THREE.DoubleSide}
				depthWrite={false}
				polygonOffset={true}
				polygonOffsetFactor={-1}
			/>
		</mesh>
	);
};

export default PlanetRings;