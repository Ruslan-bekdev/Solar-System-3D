import React, {useEffect} from 'react';
import styles from './controlHint.module.less';
import planetsConfig from '../../configs/planets.json';
import zoomMap from "../../configs/zoomMap.json";
import CAMERA_MODES from "../../configs/cameraModes.js";
import defaultZoom from "../../configs/defaultZoom.json";

const ControlHint = (
	{
		planetRefs,
		setFocusRef,
		setCameraMode,
		setZoomDistance,
		setShadows,
		setDetailsPanelOpen,
		isHintsVisible,
		setIsHintsVisible
	}
) => {
	useEffect(() => {
		const onKeyDown = (event) => {
			const {key} = event;
			const index = +key-1;

			switch (key.toLowerCase()) {
				case '0':
					setFocusRef({ref: null, name: ''});
					setZoomDistance(defaultZoom);
					setCameraMode(CAMERA_MODES.FREE);
					break;
				case '-':
					setShadows(false);
					break;
				case '=':
				case '+':
					setShadows(true);
					break;
				case 'i':
				case 'ш':
					setDetailsPanelOpen(prev => !prev);
					break;
				case 'h':
				case'р':
					setIsHintsVisible(prev => !prev);
					break;
			}

			if (!isNaN(index) && index >= 0 && index < planetsConfig.length) {
				const planet = planetsConfig[index];
				if (!planet) return;
				const mesh = planetRefs.current[planet.name];
				if (!mesh) return;

				setFocusRef({ref:mesh, name:planet.name});
				setCameraMode(CAMERA_MODES.FOCUS);
				const settings = zoomMap[planet.name];
				setZoomDistance(settings);
			}
		};

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [planetRefs, setFocusRef, setCameraMode, setZoomDistance]);

	if (!isHintsVisible) return null;

	return (
		<div className={styles.controlHint} role="note" aria-label="Подсказка по клавишам управления">
			<p>
				<strong>Клавиши:</strong><br/>
				0 - свободно, 1–8 - планеты, <br/>
				- / + - тени,
				I - информация <br/>
				H - показать/скрыть подсказки
			</p>
		</div>
	);
};

export default ControlHint;