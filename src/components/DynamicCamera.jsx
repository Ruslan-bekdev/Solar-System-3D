import {useFrame, useThree} from "@react-three/fiber";
import {useEffect, useRef} from "react";
import * as THREE from "three";
import CAMERA_MODES from "../configs/cameraModes.js";

const ANIMATION_DURATION_FOCUS = 2.0;
const ANIMATION_DURATION_FINALIZE = 1;
const ANIMATION_DURATION_FREE = 1.5;

const MIN_POLAR_ANGLE = 0.1;
const MAX_POLAR_ANGLE = Math.PI - 0.1;

export const PRELOADER_ANIMATION_DURATION = 5;
export const PRELOADER_ANIMATION_POSITION = 4500;

const easeOutQuad = t => t * (2 - t);
const easeInOutQuad = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

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
	const prevCameraMode = useRef(cameraMode);
	const freeAnimStartPos = useRef(new THREE.Vector3());
	const freeAnimStartTarget = useRef(new THREE.Vector3());

	const firstLoadAnimation = useRef(true);
	const firstLoadTime = useRef(0);
	const firstLoadStartPos = useRef(new THREE.Vector3());

	useEffect(() => {
		if (firstLoadAnimation.current) {
			firstLoadStartPos.current.set(0, 0, PRELOADER_ANIMATION_POSITION);
			camera.position.copy(firstLoadStartPos.current);
		}
	}, []);

	const animateInitialLoad = (delta, controls) => {
		firstLoadTime.current += delta;
		const rawT = Math.min(firstLoadTime.current / PRELOADER_ANIMATION_DURATION, 1);
		const t = easeInOutQuad(rawT);

		camera.position.lerpVectors(firstLoadStartPos.current, defaultPosition, t);
		controls.target.lerpVectors(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), t);

		if (rawT >= 1) {
			firstLoadAnimation.current = false;
			camera.position.copy(defaultPosition);
			controls.target.set(0, 0, 0);
			controls.update();
		}
	};

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
			if (prevCameraMode.current === CAMERA_MODES.FOCUS) {
				isAnimating.current = true;
				freeInitialized.current = false;

				freeAnimStartPos.current.copy(camera.position);
				freeAnimStartTarget.current.copy(controls.target);
			} else {
				isAnimating.current = false;
				finalizing.current = false;
				freeInitialized.current = true;

				camera.position.copy(defaultPosition);
				if (controls) {
					controls.target.set(0, 0, 0);
					applyFreeControlsSettings(controls)
				}
					controls.update();
			}
		}

		prevCameraMode.current = cameraMode;
	}, [cameraMode, defaultPosition, targetRef, controlsRef, zoomDistance.min, zoomDistance.max]);

	const calculateFocusTargetPosition = (controls) => {
		const worldPos = new THREE.Vector3();
		targetRef.current.getWorldPosition(worldPos);

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
			worldPos.x + desiredDistance * Math.sin(polarAngle) * Math.sin(azimuthalAngle),
			worldPos.y + desiredDistance * Math.cos(polarAngle),
			worldPos.z + desiredDistance * Math.sin(polarAngle) * Math.cos(azimuthalAngle)
		);
	};

	const animateFocusApproach = (delta, controls) => {
		animationTime.current += delta;
		camera.position.lerp(targetPosition.current, lerpFactor);

		const worldTarget = new THREE.Vector3();
		targetRef.current.getWorldPosition(worldTarget);
		controls.target.lerp(worldTarget, lerpFactor);

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

		const worldTarget = new THREE.Vector3();
		targetRef.current.getWorldPosition(worldTarget);
		controls.target.lerp(worldTarget, lerpFactor * 4);

		if (animationTime.current > ANIMATION_DURATION_FINALIZE) {
			camera.position.copy(targetPosition.current);

			const worldTargetFinal = new THREE.Vector3();
			targetRef.current.getWorldPosition(worldTargetFinal);
			controls.target.copy(worldTargetFinal);

			finalizing.current = false;
			isAnimating.current = false;
		}
	};

	const animateFreeTransition = (delta, controls) => {
		animationTime.current += delta;
		const rawT = Math.min(animationTime.current / ANIMATION_DURATION_FREE, 1);
		const t = easeOutQuad(rawT);

		camera.position.lerpVectors(freeAnimStartPos.current, defaultPosition, t);
		controls.target.lerpVectors(freeAnimStartTarget.current, new THREE.Vector3(0, 0, 0), t);

		if (rawT === 1) {
			isAnimating.current = false;
			freeInitialized.current = true;

			camera.position.copy(defaultPosition);
			controls.target.set(0, 0, 0);
			applyFreeControlsSettings(controls);
			controls.update();
		}
	};

	const setFocusPositionDirectly = (controls) => {
		camera.position.copy(targetPosition.current);

		const worldTarget = new THREE.Vector3();
		targetRef.current.getWorldPosition(worldTarget);
		controls.target.copy(worldTarget);
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
		controls.minDistance = zoomDistance.min;
		controls.maxDistance = zoomDistance.max;
		controls.minPolarAngle = 0;
		controls.maxPolarAngle = Math.PI;
		controls.enableZoom = true;
		controls.enableRotate = true;
		controls.enablePan = true;
	};

	useFrame((_, delta) => {
		const controls = controlsRef.current;
		if (!controls) return;

		if (firstLoadAnimation.current) {
			animateInitialLoad(delta, controls);
			return;
		}

		if (
			cameraMode === CAMERA_MODES.FOCUS &&
			targetRef?.current?.position &&
			zoomDistance &&
			typeof zoomDistance.distance === "number"
		) {
			calculateFocusTargetPosition(controls);

			if (isAnimating.current) {
				animateFocusApproach(delta, controls);

				if (camera.position.distanceTo(targetPosition.current) < 0.5 && !finalizing.current) {
					calculateFocusTargetPosition(controls);

					camera.position.lerp(targetPosition.current, 0);

					const worldTarget = new THREE.Vector3();
					targetRef.current.getWorldPosition(worldTarget);
					controls.target.lerp(worldTarget, 0);
				}
			} else if (finalizing.current) {
				finalizeFocusPosition(delta, controls);
			} else {
				setFocusPositionDirectly(controls);
			}


			controls.update();
		} else if (cameraMode === CAMERA_MODES.FREE) {
			if (isAnimating.current) {
				animateFreeTransition(delta, controls);
			}
			if (!freeInitialized.current) return;
			controls.update();
		}
	});

	return null;
};

export default DynamicCamera;