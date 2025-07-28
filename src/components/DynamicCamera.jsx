import {useFrame, useThree} from "@react-three/fiber";
import {useEffect, useRef} from "react";
import * as THREE from "three";
import CAMERA_MODES from "../configs/cameraModes.js";

const ANIMATION_DURATION_FOCUS = 1.0;
const ANIMATION_DURATION_FINALIZE = 0.3;
const ANIMATION_DURATION_FREE = 1.5;
const ANIMATION_DURATION_FINALIZE_FREE = 0.5;

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

	// Инициализация анимации при смене режима
	useEffect(() => {
		animationTime.current = 0;
		finalizing.current = false;

		if (cameraMode === CAMERA_MODES.FOCUS && targetRef?.current)
			isAnimating.current = true;
		else if (cameraMode === CAMERA_MODES.FREE) {
			isAnimating.current = true;
			targetPosition.current.copy(defaultPosition);
		}
	}, [cameraMode, defaultPosition, targetRef]);

	// Функции для логики фокусного режима
	const calculateFocusTargetPosition = (controls) => {
		const targetPos = targetRef.current.position;
		const azimuthalAngle = controls.getAzimuthalAngle();
		const polarAngle = THREE.MathUtils.clamp(
			controls.getPolarAngle(),
			MIN_POLAR_ANGLE,
			MAX_POLAR_ANGLE
		);
		const desiredDistance = Math.max(zoomDistance.distance, zoomDistance.min);

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

	// Функции для логики свободного режима
	const animateFreeApproach = (delta, controls) => {
		animationTime.current += delta;

		camera.position.lerp(targetPosition.current, lerpFactor);
		controls.target.lerp(new THREE.Vector3(0, 0, 0), lerpFactor);
		controls.update();

		if (
			(animationTime.current > ANIMATION_DURATION_FREE ||
				camera.position.distanceTo(targetPosition.current) < 0.05) &&
			!finalizing.current
		) {
			finalizing.current = true;
			animationTime.current = 0;
		}
	};

	const finalizeFreePosition = (delta, controls) => {
		animationTime.current += delta;

		camera.position.lerp(targetPosition.current, lerpFactor * 4);
		controls.target.lerp(new THREE.Vector3(0, 0, 0), lerpFactor * 4);
		controls.update();

		if (animationTime.current > ANIMATION_DURATION_FINALIZE_FREE) {
			camera.position.copy(targetPosition.current);
			controls.target.set(0, 0, 0);
			finalizing.current = false;
			isAnimating.current = false;
		}
	};

	const setFreePositionDirectly = (controls) => {
		camera.position.copy(targetPosition.current);
		controls.target.set(0, 0, 0);
		controls.enableZoom = true;
		controls.enableRotate = true;
		controls.minDistance = 10;
		controls.maxDistance = 100;
		controls.minPolarAngle = 0;
		controls.maxPolarAngle = Math.PI;
	};

	// вызов функций
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

			applyFocusControlsSettings(controls);
			controls.update();
		} else if (cameraMode === CAMERA_MODES.FREE) {
			targetPosition.current.copy(defaultPosition);

			controls.minDistance = 10;
			controls.maxDistance = 100;

			if (isAnimating.current)
				animateFreeApproach(delta, controls);
			else if (finalizing.current)
				finalizeFreePosition(delta, controls);
			else {
				setFreePositionDirectly(controls);
				controls.update();
			}
		}
	});

	return null;
};

export default DynamicCamera;