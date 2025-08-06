import React, {useEffect, useState} from 'react';
import styles from './components.module.less';
import planetsConfig from '../configs/planets.json';
import zoomMap from "../configs/zoomMap.json";
import CAMERA_MODES from "../configs/cameraModes.js";
import defaultZoom from "../configs/defaultZoom.json";

const ToggleButton = ({showControls, setShowControls}) => (
	<div className={styles.toggleButtonWrapper}>
		<button
			className={styles.toggleButton}
			onClick={() => setShowControls(!showControls)}
			title={showControls ?'Скрыть' :'Показать'}
		>
			{showControls ?'×' :'☰'}
		</button>
		{showControls && (
			<span className={styles.toggleHint}>
				Клавиши: 0-8,-+
			</span>
		)}
	</div>
);

const FreeButton = ({setFocusRef, setZoomDistance, setCameraMode}) => (
	<button onClick={() => {
		setFocusRef({ref: null, name: ''});
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
		mesh.current.name = name;
		setFocusRef({name: name, ref:mesh});
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
	const {showControls} = props;

	return (
		<div className={`${styles.controlButtons} ${!showControls ? styles.hiddenButtons : ''}`}>
			<FreeButton {...props} />
			<ShadowToggleButton {...props} />
			<PlanetButtons {...props} />
		</div>
	);
};

const ControlPanel = (props) => {
	const {planetRefs, setFocusRef, setCameraMode, setZoomDistance, setShadows} = props;
	const [showControls, setShowControls] = useState(false);

	useEffect(() => {
		const keyToPlanetIndex = {
			'1': 0,
			'2': 1,
			'3': 2,
			'4': 3,
			'5': 4,
			'6': 5,
			'7': 6,
			'8': 7,
			'9': 8,
		};

		const onKeyDown = (event) => {
			const {key} = event;

			if (key === '0') {
				setFocusRef({ref: null, name: ''});
				setZoomDistance(defaultZoom);
				setCameraMode(CAMERA_MODES.FREE);
				return;
			}

			if (key === '-') {
				setShadows(false);
				return;
			}

			if (key === '=' || key === '+') {
				setShadows(true);
				return;
			}


			if (Object.prototype.hasOwnProperty.call(keyToPlanetIndex, key)) {
				const idx = keyToPlanetIndex[key];
				const planet = planetsConfig[idx];
				if (!planet) return;
				const mesh = planetRefs.current[planet.name];
				if (!mesh) return;

				setFocusRef({ref:mesh, name:planet.name});
				setCameraMode(CAMERA_MODES.FOCUS);
				const settings = zoomMap[planet.name] || { distance: 5, min: 2, max: 10 };
				setZoomDistance(settings);
			}
		};

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [planetRefs, setFocusRef, setCameraMode, setZoomDistance]);

	return (
		<div className={styles.controlPanel}>
			<ToggleButton showControls={showControls} setShowControls={setShowControls}/>
			<ControlButtons {...props} showControls={showControls}/>
		</div>
	);
};

export default ControlPanel;