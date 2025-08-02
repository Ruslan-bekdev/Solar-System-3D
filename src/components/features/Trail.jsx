import React, {useEffect} from "react";
import {Trail} from "@react-three/drei";

const RenderTrail = ({trail, meshRef}) => {
	const [trailKey, setTrailKey] = React.useState(0);

	useEffect(() => {
		const onFocus = () => setTrailKey((k) => k + 1);
		window.addEventListener("focus", onFocus);
		return () => window.removeEventListener("focus", onFocus);
	}, []);

	return (
		<Trail
			key={trailKey}
			target={meshRef}
			width={trail.width}
			length={trail.length}
			color={trail.color}
			decay={trail.decay}
			attenuation={(t) => Math.pow(t, 5)}
		/>
	);
};

export default RenderTrail;