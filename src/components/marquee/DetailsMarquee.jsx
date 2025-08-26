import React, {useEffect, useRef} from "react";
import styles from "./detailsMarquee.module.less";

const DetailsMarquee = ({items}) => {
	const marqueeRef = useRef(null);

	useEffect(() => {
		const marquee = marqueeRef.current;
		if (!marquee) return;

		const keyframes = [
			{transform: 'translateX(0)'},
			{transform: 'translateX(-50%)'}
		];

		const options = {
			duration: 20000,
			iterations: Infinity,
			easing: 'linear'
		};

		marquee.animate(keyframes, options);
	}, []);

	const renderItems = () => items.map((item, i) => (
		<div className={styles.factCard} key={i}>
			{item}
		</div>
	));

	return (
		<div className={styles.marquee}>
			<div className={styles.marqueeContent} ref={marqueeRef}>
				{renderItems()}
				{renderItems()}
			</div>
		</div>
	);
};

export default DetailsMarquee;