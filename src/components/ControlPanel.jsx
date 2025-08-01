import React, {useState} from 'react';
import styles from './components.module.less';
import planetsConfig from '../configs/planets.json';
import zoomMap from "../configs/zoomMap.json";
import CAMERA_MODES from "../configs/cameraModes.js";
import defaultZoom from "../configs/defaultZoom.json";

const ToggleButton = ({showControls, setShowControls}) => (
	<button
		className={styles.toggleButton}
		onClick={() => setShowControls(!showControls)}
		title={showControls ?'Скрыть' :'Показать'}
	>
		{showControls ?'×' :'☰'}
	</button>
);

const FreeButton = ({setFocusRef, setZoomDistance, setCameraMode}) => (
	<button onClick={() => {
		setFocusRef(null);
		setZoomDistance(defaultZoom);
		setCameraMode(CAMERA_MODES.FREE);
	}}>
		Свободно
	</button>
);

const ShadowToggleButton = ({shadows, setShadows}) => (
	<button onClick={() => setShadows(!shadows)}>
		{shadows ?'Выключить тени' :'Включить тени'}
	</button>
);

const PlanetButtons = ({planetRefs, setFocusRef, setCameraMode, setZoomDistance}) => {
	const handleFocusPlanet = (mesh, name) => {
		if (!mesh) return;
		setFocusRef(mesh);
		setCameraMode(CAMERA_MODES.FOCUS);

		const settings = zoomMap[name] || {distance: 5, min: 2, max: 10};
		setZoomDistance(settings);
	};

	return (
		<>
			{planetsConfig.map((planet) => (
				<button
					key={planet.name}
					onClick={() => handleFocusPlanet(
						planetRefs.current[planet.name], planet.name
					)}
				>
					{planet.name}
				</button>
			))}
		</>
	);
};

const ControlButtons = (props) => {
	const { showControls} = props;

	return (
		<div className={`${styles.controlButtons} ${!showControls ? styles.hiddenButtons : ''}`}>
			<FreeButton {...props} />
			<ShadowToggleButton {...props} />
			<PlanetButtons {...props} />
		</div>
	);
};

const ControlPanel = (props) => {
	const [showControls, setShowControls] = useState(false);

	return (
		<div className={styles.controlPanel}>
			<ToggleButton showControls={showControls} setShowControls={setShowControls}/>
			<ControlButtons {...props} showControls={showControls}/>
		</div>
	);
};

export default ControlPanel;