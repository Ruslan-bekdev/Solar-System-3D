import React, {useEffect, useState} from 'react';
import styles from './controlHint.module.less';
import planetsConfig from '../../configs/planets.json';
import zoomMap from "../../configs/zoomMap.json";
import CAMERA_MODES from "../../configs/cameraModes.js";
import defaultZoom from "../../configs/defaultZoom.json";

const ControlHint = (props) => {
	const {planetRefs, setFocusRef, setCameraMode, setZoomDistance, setShadows} = props;
	const [isHintVisible, setIsHintVisible] = useState(true);

	useEffect(() => {
		const onKeyDown = (event) => {
			const {key} = event;
			const index = +key-1;

			switch (key.toLowerCase()) {
				case 'h':
				case'р':
					setIsHintVisible(prev => !prev);
					break;
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
			}

			if (!isNaN(index) && index >= 0 && index < planetsConfig.length) {
				const planet = planetsConfig[index];
				console.log(index,planetsConfig.length,planet)
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

	if (!isHintVisible) return null;

	return (
		<div className={styles.controlHint}>
			<p>
				<strong>Клавиши управления:</strong><br/>
				0 – свободно, 1–8 – планеты, - / + – тени, H – показать/скрыть подсказку
			</p>
		</div>
	);
};

export default ControlHint;