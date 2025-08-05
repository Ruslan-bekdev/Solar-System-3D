import React, {useEffect} from "react";
import * as THREE from "three";
import {Canvas} from "@react-three/fiber";
import Sun from "./Sun.jsx";
import Planets from "./Planets.jsx";
import StarField from "./StarField.jsx";
import {OrbitControls} from "@react-three/drei";
import DynamicCamera from "./DynamicCamera.jsx";

const SolarSystem = ({
	                     shadows = true,
	                     planetRefs,
	                     focusRef,
	                     zoomDistance,
	                     setZoomDistance,
	                     controlsRef,
	                     cameraMode,
                     }) => {
	const defaultCameraPos = new THREE.Vector3(0, 30, zoomDistance.distance);

	useEffect(() => {
		const handleWheel = (event) => {
			if (!focusRef.ref) return;

			event.preventDefault();
			let delta = event.deltaY * 0.01;
			let newDist = Math.max(zoomDistance.min, Math.min(zoomDistance.max, zoomDistance.distance + delta));

			if (newDist !== zoomDistance.distance) {
				setZoomDistance({...zoomDistance, distance: newDist});
			}
		};

		window.addEventListener("wheel", handleWheel, {passive: false});
		return () => window.removeEventListener("wheel", handleWheel);
	}, [zoomDistance, setZoomDistance, focusRef.ref]);

	return (
		<Canvas camera={{position: [0, 20, 60], fov: 60}} shadows>
			<ambientLight intensity={shadows ? 0.05 : 1.0}/>
			{shadows && (
				<pointLight
					position={[0, 0, 0]}
					intensity={1000}
					distance={200}
					decay={2}
					castShadow={true}
					shadow-mapSize-width={2048}
					shadow-mapSize-height={2048}
				/>
			)}

			<Sun refCallback={(ref) => (planetRefs.current["Sun"] = ref)} shadows={shadows}/>
			<Planets planetRefs={planetRefs} shadows={shadows} focusRefName={focusRef.name} cameraMode={cameraMode}/>
			<StarField/>
			<OrbitControls ref={controlsRef} makeDefault/>

			<DynamicCamera
				targetRef={focusRef.ref}
				controlsRef={controlsRef}
				zoomDistance={zoomDistance}
				defaultPosition={defaultCameraPos}
				lerpFactor={0.08}
				cameraMode={cameraMode}
			/>
		</Canvas>
	);
};

export default SolarSystem;
