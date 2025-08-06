import React, {useRef, useEffect} from "react";

const Glossiness = ({glossiness, map, color}) => {
	const materialRef = useRef();

	const {
		metalness,
		roughness
	} = glossiness;

	useEffect(() => {
		if (materialRef.current) {
			materialRef.current.metalness = metalness;
			materialRef.current.roughness = roughness;
			materialRef.current.needsUpdate = true;
		}
	}, [metalness, roughness]);

	return (
		<meshStandardMaterial
			ref={materialRef}
			map={map}
			color={color}
			metalness={metalness}
			roughness={roughness}
		/>
	);
};

export default Glossiness;
