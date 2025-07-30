import {useFrame, useThree} from "@react-three/fiber";
import {useEffect, useRef} from "react";
import * as THREE from "three";
import CAMERA_MODES from "../configs/cameraModes.js";

const ANIMATION_DURATION_FOCUS = 1.0;
const ANIMATION_DURATION_FINALIZE = 0.3;

const MIN_POLAR_ANGLE = 0.1;
const MAX_POLAR_ANGLE = Math.PI - 0.1;

const DynamicCamera = ({
	                       targetRef,
	                       controlsRef,
	                       zoomDistance,
	                       defaultPosition,
	                       lerpFactor = 0.05,
	                       cameraMode,
                       }) => {
	const {camera} = useThree();

	const targetPosition = useRef(new THREE.Vector3());
	const animationTime = useRef(0);
	const finalizing = useRef(false);
	const isAnimating = useRef(false);
	const freeInitialized = useRef(false);

	useEffect(() => {
		animationTime.current = 0;
		finalizing.current = false;

		const controls = controlsRef.current;

		if (cameraMode === CAMERA_MODES.FOCUS && targetRef?.current) {
			isAnimating.current = true;
			freeInitialized.current = false;
			if (controls) {
				applyFocusControlsSettings(controls);
				controls.update();
			}
		} else if (cameraMode === CAMERA_MODES.FREE) {
			isAnimating.current = false;
			finalizing.current = false;
			freeInitialized.current = true;

			camera.position.copy(defaultPosition);
			if (controls) {
				controls.target.set(0, 0, 0);
				applyFreeControlsSettings(controls)
				controls.update();
			}
		}
	}, [cameraMode, defaultPosition, targetRef, controlsRef, camera, zoomDistance.min, zoomDistance.max]);

	const calculateFocusTargetPosition = (controls) => {
		const targetPos = targetRef.current.position;
		const azimuthalAngle = controls.getAzimuthalAngle();
		const polarAngle = THREE.MathUtils.clamp(
			controls.getPolarAngle(),
			MIN_POLAR_ANGLE,
			MAX_POLAR_ANGLE
		);
		const desiredDistance = THREE.MathUtils.clamp(
			zoomDistance.distance,
			zoomDistance.min,
			zoomDistance.max
		);
		targetPosition.current.set(
			targetPos.x + desiredDistance * Math.sin(polarAngle) * Math.sin(azimuthalAngle),
			targetPos.y + desiredDistance * Math.cos(polarAngle),
			targetPos.z + desiredDistance * Math.sin(polarAngle) * Math.cos(azimuthalAngle)
		);
	};

	const animateFocusApproach = (delta, controls) => {
		animationTime.current += delta;
		camera.position.lerp(targetPosition.current, lerpFactor);
		controls.target.lerp(targetRef.current.position, lerpFactor);

		if (
			(animationTime.current > ANIMATION_DURATION_FOCUS ||
				camera.position.distanceTo(targetPosition.current) < 0.05) &&
			!finalizing.current
		) {
			finalizing.current = true;
			animationTime.current = 0;
		}
	};

	const finalizeFocusPosition = (delta, controls) => {
		animationTime.current += delta;
		camera.position.lerp(targetPosition.current, lerpFactor * 4);
		controls.target.lerp(targetRef.current.position, lerpFactor * 4);

		if (animationTime.current > ANIMATION_DURATION_FINALIZE) {
			camera.position.copy(targetPosition.current);
			controls.target.copy(targetRef.current.position);
			finalizing.current = false;
			isAnimating.current = false;
		}
	};

	const setFocusPositionDirectly = (controls) => {
		camera.position.copy(targetPosition.current);
		controls.target.copy(targetRef.current.position);
	};

	const applyFocusControlsSettings = (controls) => {
		controls.minDistance = zoomDistance.min;
		controls.maxDistance = zoomDistance.max;
		controls.enableZoom = true;
		controls.enableRotate = true;
		controls.minPolarAngle = MIN_POLAR_ANGLE;
		controls.maxPolarAngle = MAX_POLAR_ANGLE;
	};

	const applyFreeControlsSettings = (controls) => {
		controls.minDistance = 10;
		controls.maxDistance = 100;
		controls.minPolarAngle = 0;
		controls.maxPolarAngle = Math.PI;
		controls.enableZoom = true;
		controls.enableRotate = true;
		controls.enablePan = true;
	};


	useFrame((_, delta) => {
		const controls = controlsRef.current;
		if (!controls) return;

		if (
			cameraMode === CAMERA_MODES.FOCUS &&
			targetRef?.current?.position &&
			zoomDistance &&
			typeof zoomDistance.distance === "number"
		) {
			calculateFocusTargetPosition(controls);

			if (isAnimating.current) {
				animateFocusApproach(delta, controls);
			} else if (finalizing.current) {
				finalizeFocusPosition(delta, controls);
			} else {
				setFocusPositionDirectly(controls);
			}

			controls.update();
		} else if (cameraMode === CAMERA_MODES.FREE) {
			if (!freeInitialized.current) return;
			controls.update();
		}
	});

	return null;
};

export default DynamicCamera;