import React from "react";
import styles from './loadinScreen.module.less';

const LoaderScreen = ({progress}) => {
	return (
		<div className={styles.loaderScreen}>
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
					<h2>{progress}%</h2>
				</div>
			</div>
		</div>
	);
}

export default LoaderScreen