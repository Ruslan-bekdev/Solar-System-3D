import React from "react";
import styles from './components.module.less';

const LoaderScreen = ({progress, rocket}) => {
	return (
		<div className={styles.loaderScreen}>
			<div
				className={styles.progressBarWrapper}
			>
				<div
					className={styles.progressBar}
					style={{height: `${progress}%`}}
				/>
				<img
					src={rocket}
					alt="rocket"
					className={styles.rocketIcon}
					style={{bottom: `calc(${progress}% - 15px)`}}
				/>
			</div>
			<h2>{progress}%</h2>
		</div>
	);
}

export default LoaderScreen