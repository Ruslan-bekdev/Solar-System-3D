import React, {useMemo} from "react";
import {useTexture} from "@react-three/drei";
import * as THREE from "three";

const Rings = ({ring}) => {
	const {texture, tiltDeg, innerFactor, outerFactor, opacity, segments} = ring;
	const ringTexture = useTexture(texture);
	const tiltRad = useMemo(
		() => THREE.MathUtils.degToRad(tiltDeg - 90),
		[tiltDeg]
	);
	return (
		<mesh
			rotation={[tiltRad, 0, 0]}
			renderOrder={1}
		>
			<ringGeometry
				args={[innerFactor, outerFactor, segments ?? 128, 1]}
			/>
			<meshBasicMaterial
				map={ringTexture}
				alphaMap={ringTexture}
				transparent={true}
				opacity={opacity ?? 0.9}
				side={THREE.DoubleSide}
				depthWrite={false}
				polygonOffset={true}
				polygonOffsetFactor={-1}
			/>
		</mesh>
	);
};

export default Rings;