import './App.less';
import React, {useState, useRef} from 'react';
import SolarSystem from "./components/SolarSystem.jsx";
import ControlHint from "./components/controlHint/ControlHint.jsx";
import defaultZoom from './configs/defaultZoom';
import CAMERA_MODES from './configs/cameraModes';
import useDisablePageZoom from "./hooks/useDisablePageZoom.js";

const App = () => {
	const [shadows, setShadows] = useState(true);
	const [zoomDistance, setZoomDistance] = useState(defaultZoom);
	const [focusRef, setFocusRef] = useState({ref: null, name: ''});
	const [cameraMode, setCameraMode] = useState(CAMERA_MODES.FREE);

	const planetRefs = useRef({});
	const controlsRef = useRef();

	const solarSystemProps = {
		shadows,
		setShadows,
		zoomDistance,
		setZoomDistance,
		planetRefs,
		focusRef,
		setFocusRef,
		controlsRef,
		cameraMode,
		setCameraMode,
	};

	useDisablePageZoom(true);

	return (
		<>
			<SolarSystem {...solarSystemProps}/>
			<ControlHint {...solarSystemProps}/>
		</>
	)};

export default App;