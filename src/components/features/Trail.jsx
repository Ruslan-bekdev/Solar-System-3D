import React, {useEffect} from "react";
import {Trail} from "@react-three/drei";

const RenderTrail = ({trail, meshRef}) => {
	const {width, length, color, decay} = trail;
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
			width={width}
			length={length}
			color={color}
			decay={decay}
			attenuation={(t) => Math.pow(t, 5)}
		/>
	);
};

export default RenderTrail;