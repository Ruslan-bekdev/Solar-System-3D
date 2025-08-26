import React, {useEffect, useRef} from "react";
import styles from "./detailsPanel.module.less";
import DetailsMarquee from "../marquee/DetailsMarquee.jsx";

const DetailsPanel = ({focusRef, detailsPanelOpen, setDetailsPanelOpen}) => {
	const toggleOpen = () => setDetailsPanelOpen(p => !p);
	const displayName = focusRef.name || "Солнце";
	const startsWithVowel = (text) => /^[аеёиоуыэюя]/i.test(text);
	const name = (name) => {
		if (/й$/i.test(name)) return name.slice(0, -1) + "и";
		if (/[аеёиоуыэюя]$/i.test(name)) return name.slice(0, -1) + "е";
		return name + "е";
	};

	const scrollAreaRef = useRef(null);


	useEffect(() => {
		if (!detailsPanelOpen) return;

		const onWindowWheelCapture = (e) => {
			if (scrollAreaRef.current && scrollAreaRef.current.contains(e.target)) return;
			e.preventDefault();
			e.stopPropagation();
		};

		const onWindowTouchMoveCapture = (e) => {
			if (scrollAreaRef.current && scrollAreaRef.current.contains(e.target)) return;
			e.preventDefault();
			e.stopPropagation();
		};

		const stopPropOnly = (e) => {
			e.stopPropagation();
		};

		window.addEventListener("wheel", onWindowWheelCapture, {capture: true, passive: false});
		window.addEventListener("touchmove", onWindowTouchMoveCapture, {capture: true, passive: false});

		const area = scrollAreaRef.current;
		if (area) {
			area.addEventListener("wheel", stopPropOnly, {capture: true, passive: false});
			area.addEventListener("touchmove", stopPropOnly, {capture: true, passive: false});
		}

		return () => {
			window.removeEventListener("wheel", onWindowWheelCapture, {capture: true});
			window.removeEventListener("touchmove", onWindowTouchMoveCapture, {capture: true});
			if (area) {
				area.removeEventListener("wheel", stopPropOnly, {capture: true});
				area.removeEventListener("touchmove", stopPropOnly, {capture: true});
			}
		};
	}, [detailsPanelOpen]);


	return (
		<aside className={styles.detailsPanel}>
			<button onClick={toggleOpen}>
				{
					detailsPanelOpen
						? "Скрыть (I)"
						: `Узнать ${startsWithVowel(displayName) ? "об" : "о"} ${name(displayName)} (I)`
				}
			</button>

			{detailsPanelOpen && (
				<div className={styles.panelContent}>
					<div className={styles.bgPlanets}></div>
					<h2>{displayName}</h2>

					<div className={styles.scrollArea} ref={scrollAreaRef}>
						<div className={styles.section}>
							<h3>Описание</h3>
							<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquam aperiam aspernatur deserunt eius eum illum incidunt, ipsam, magnam maiores optio provident quae qui quidem recusandae reprehenderit, repudiandae suscipit tempora tempore ullam! Debitis delectus est facere in labore quod reiciendis sint unde.</p>
						</div>
						<div className={styles.glowDivider}></div>
						<div className={styles.section}>
							<h3>История исследований</h3>
							<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet architecto aut beatae error, officia sapiente sint ullam. Animi neque placeat quos soluta tempore. A ad at, error fugit harum iusto laborum maiores mollitia natus optio quae ratione rem sint veritatis vitae, voluptatem?</p>
						</div>
						<div className={styles.glowDivider}></div>
						<div className={styles.section}>
							<h3>Интересные факты</h3>
							<ul>
								<li>👌 Интересный факт 1</li>
								<li>😢 Неинтересный факт 2</li>
								<li>🤔 Посредственный по интересу факт 3</li>
							</ul>
						</div>
					</div>

					<DetailsMarquee items={[
						"🌡 5000°C",
						"🌍 Спутников: 2",
						"🌀 Атмосфера: N₂",
						"🛰 Первая сфотографирована",
						"🔥 Самая горячая",
						"🌌 Самая яркая"
					]} />
				</div>
			)}
		</aside>
	);
};

export default DetailsPanel;
