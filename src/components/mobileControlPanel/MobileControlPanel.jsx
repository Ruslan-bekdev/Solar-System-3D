import React, {useState} from 'react';
import styles from './mobileControlPanel.module.less';
import planetsConfig from '../../configs/planets.json';
import zoomMap from "../../configs/zoomMap.json";
import CAMERA_MODES from "../../configs/cameraModes.js";
import defaultZoom from "../../configs/defaultZoom.json";

const MobileControlPanel = (
	{
		planetRefs,
		setFocusRef,
		setCameraMode,
		setZoomDistance,
		setShadows,
		isHintsVisible,
		setIsHintsVisible
	}
) => {
	const [planetNumber, setPlanetNumber] = useState(0);

	const setFreeMode = () => {
		setFocusRef({ref: null, name: ''});
		setZoomDistance(defaultZoom);
		setCameraMode(CAMERA_MODES.FREE);
		setPlanetNumber(0);
	};
	const setFocusMode = (number) => {
		const index = +number-1;

		if (!isNaN(index) && index >= 0 && index < planetsConfig.length) {
			const planet = planetsConfig[index];
			if (!planet) return;
			const mesh = planetRefs.current[planet.name];
			if (!mesh) return;
			const settings = zoomMap[planet.name];

			setFocusRef({ref:mesh, name:planet.name});
			setCameraMode(CAMERA_MODES.FOCUS);
			setZoomDistance(settings);
			setPlanetNumber(number);
		}
	};
	const toggleShadowsVisible = () =>
		setShadows(prev => !prev);

	const toggleHintsVisible = () =>
		setIsHintsVisible(prev => !prev);

	return (
		<div className={styles.controlPanel} role="note" aria-label="Панель управления">
			<button className={`${styles.controlPanelBtn} ${styles.hintsToggleBtn} ${!isHintsVisible ?styles.hidden :''}`} onClick={toggleHintsVisible}>
				{isHintsVisible ?"👁" :"—"}
			</button>
			{isHintsVisible && <>
				<button className={styles.controlPanelBtn} onClick={toggleShadowsVisible}>Тень</button>
				<button className={styles.controlPanelBtn} onClick={setFreeMode}>0</button>
				<div className={styles.planetFocusCounter}>
					<span className={styles.counterStepUp} onClick={() => setFocusMode(planetNumber+1)}>{planetNumber < planetsConfig.length ?'^' :'-'}</span>
					<span className={styles.counterValue}>{planetNumber}</span>
					<span className={styles.counterStepDown} onClick={() => setFocusMode(planetNumber-1)}>{planetNumber >1 ?'^' :'-'}</span>
				</div>
			</>}
		</div>
	);
};

export default MobileControlPanel;