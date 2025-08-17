import React, {useEffect, useMemo, useState} from "react";
import * as THREE from "three";
import {Canvas} from "@react-three/fiber";
import Sun from "./Sun.jsx";
import Planets from "./Planets.jsx";
import StarField from "./StarField.jsx";
import {OrbitControls} from "@react-three/drei";
import DynamicCamera from "./DynamicCamera.jsx";
import planets from '../configs/planets.json';
import Prewarm from "./Prewarm.jsx";
import useTextureProgress from "../hooks/useTextureProgress.js";
import LoaderScreen from "./loadingScreen/LoaderScreen.jsx";

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
	const [prewarmed, setPrewarmed] = useState(false);
	const [showOverlay, setShowOverlay] = useState(true);
	const [allLoaded, setAllLoaded] = useState(false);
	const basePath = import.meta.env.BASE_URL;
	const texturesToPreload = useMemo(() =>
			Object.entries(planets).map(([i, planet]) => basePath + planet.texture.replace(/^\//, '')),
		[planets, basePath]
	);
	const {progress} = useTextureProgress(texturesToPreload)

	const onLoadedCallback = () => setAllLoaded(true);

	useEffect(() => {
		if (prewarmed && allLoaded && progress === 100) {
			setTimeout(() => setShowOverlay(false), 150);
		}
	}, [prewarmed, allLoaded, progress]);

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
		<>
			{showOverlay &&
				<LoaderScreen progress={progress}/>
			}
			<Canvas
				camera={{position: [0, 20, 60], fov: 60}}
				shadows={{type: THREE.PCFShadowMap}}
				gl={{antialias: true, powerPreference: "high-performance"}}
			>
				<ambientLight intensity={shadows ?0.05 :1.0}/>
				{shadows && (
					<pointLight
						position={[0, 0, 0]}
						intensity={1000}
						distance={200}
						decay={2}
						castShadow={true}
					/>
				)}
				<group visible={allLoaded && prewarmed}>
					<Sun
						refCallback={(ref) => (planetRefs.current["Sun"] = ref)}
						shadows={shadows}
					/>
					<Planets
						planetRefs={planetRefs}
						shadows={shadows}
						focusRefName={focusRef.name}
						cameraMode={cameraMode}
						onLoaded={onLoadedCallback}
					/>
					<StarField/>
				</group>

				{!prewarmed && (
					<Prewarm
						textureUrls={texturesToPreload}
						frames={3}
						targetSize={16}
						onDone={() => {
							setPrewarmed(true);
							setTimeout(()=>setShowOverlay(false), 150);
						}}
					/>
				)}
				<OrbitControls ref={controlsRef} makeDefault/>

				<DynamicCamera
					targetRef={focusRef.ref}
					controlsRef={controlsRef}
					zoomDistance={zoomDistance}
					defaultPosition={defaultCameraPos}
					lerpFactor={0.08}
					cameraMode={cameraMode}
					isReady={!showOverlay}
				/>
			</Canvas>
		</>
	);
};

export default SolarSystem;
