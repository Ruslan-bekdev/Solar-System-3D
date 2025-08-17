import React, {useEffect, useState} from "react";
import styles from './loadinScreen.module.less';

const LoaderScreen = ({progress}) => {
	const [preProgress, setPreProgress] = useState(0);
	useEffect(() => {
		const interval = setInterval(() =>
				setPreProgress(prev => prev<99 ?prev+1 :prev),
			20
		);
		return () => clearInterval(interval);
	}, []);

	return (
		<section className={styles.loaderScreen} aria-label="Loading screen">
			<div className={styles.spinnerBox}>
				<div className={`${styles.blueOrbit} ${styles.leo}`}>
				</div>

				<div className={`${styles.greenOrbit} ${styles.leo}`}>
				</div>

				<div className={`${styles.redOrbit} ${styles.leo}`}>
				</div>

				<div className={styles.whiteOrbitGroup}>
					<div className={`${styles.whiteOrbit} ${styles.fast}`}></div>
					<div className={`${styles.whiteOrbit} ${styles.medium}`}></div>
					<div className={`${styles.whiteOrbit} ${styles.slow}`}></div>
					<h2>{progress < 99 ?preProgress :progress}%</h2>
				</div>
			</div>
		</section>
	);
}

export default LoaderScreen