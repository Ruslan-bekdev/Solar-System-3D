import React, {useRef, useMemo} from 'react';
import {useFrame} from '@react-three/fiber';

const StarLayer = ({count, spread, size, rotationSpeed}) => {
	const ref = useRef();

	const positions = useMemo(() => {
		const arr = new Float32Array(count * 3);
		for (let i = 0; i < count; i++) {
			arr[i * 3] = (Math.random() - 0.5) * spread;
			arr[i * 3 + 1] = (Math.random() - 0.5) * spread;
			arr[i * 3 + 2] = (Math.random() - 0.5) * spread;
		}
		return arr;
	}, [count, spread]);

	useFrame(() => {
		if (ref.current){
			ref.current.rotation.x += rotationSpeed;
			ref.current.rotation.y += rotationSpeed * 0.7;
		}
	});

	return (
		<points ref={ref}>
			<bufferGeometry>
				<bufferAttribute
					attach="attributes-position"
					count={positions.length / 3}
					array={positions}
					itemSize={3}
				/>
			</bufferGeometry>
			<pointsMaterial
				color={0xffffff}
				size={size}
				sizeAttenuation={true}
				transparent={true}
				opacity={0.5}
			/>
		</points>
	);
};

const StarField = () => {
	return (
		<>
			<StarLayer count={2000} spread={1600} size={1.6} rotationSpeed={-0.0012}/>
			<StarLayer count={4000} spread={3000} size={2} rotationSpeed={0.0008}/>
			<StarLayer count={6000} spread={6000} size={3} rotationSpeed={-0.0003}/>
		</>
	);
};

export default StarField;