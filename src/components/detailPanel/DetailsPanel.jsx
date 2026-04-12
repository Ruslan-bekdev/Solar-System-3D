import React, {useEffect, useRef, useState} from "react";
import styles from "./detailsPanel.module.less";
import DetailsMarquee from "../marquee/DetailsMarquee.jsx";
import planets from "../../configs/planets_en.json";

const sunContent = {
	"sections": [
		{
			"title": "Overview",
			"text": "The Sun is a G2V-type main-sequence star at the center of our Solar System. Its immense gravitational pull keeps all planets in orbit, providing the essential light and thermal energy that sustains life on Earth."
		},
		{
			"title": "Quick Facts",
			"text": [
				"Surface temperature: ~5,500 °C",
				"Core temperature: ~15,000,000 °C",
				"Diameter: ~1.392 million km",
				"Light travel time to Earth: ~8 min 20 sec",
				"Composition: ~74% Hydrogen, ~24% Helium"
			]
		},
		{
			"title": "Characteristics",
			"text": "Composed of hot plasma, the Sun is driven by nuclear fusion. Its complex magnetic activity generates solar flares and solar winds, which are responsible for auroras and geomagnetic events on Earth."
		}
	],
	"marquee": [
		"The brightest celestial object",
		"Primary source of energy and life",
		"Solar flares and magnetic storms"
	],
	"nickname": "☀ Heart of the Solar System"
}

const DetailsPanel = (
	{
		focusRef,
		detailsPanelOpen,
		setDetailsPanelOpen,
		isHintsVisible
	}
) => {
	const toggleOpen = () => setDetailsPanelOpen(p => !p);
	const displayName = focusRef.name || "Sun";
	const [content, setContent] = useState(null);
	// const startsWithVowel = (text) => /^[аеёиоуыэюя]/i.test(text);
	// const name = (name) => {
	// 	if (/й$/i.test(name)) return name.slice(0, -1) + "и";
	// 	if (/[аеёиоуыэюя]$/i.test(name)) return name.slice(0, -1) + "е";
	// 	return name + "е";
	// };

	useEffect(() => {
		const planet = planets.find(planet => planet.name === focusRef.name);
		setContent(planet !== undefined
			?planet.content
			:sunContent
		);
	}, [focusRef]);

	const scrollAreaRef = useRef(null);
	const [activeSection, setActiveSection] = useState(null);

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

	const toggleSection = (id) => {
		setActiveSection(prev => (prev === id ? null : id));
		setTimeout(() => {
			const el = scrollAreaRef.current && scrollAreaRef.current.querySelector(`#sect-${id}`);
			if (el) el.scrollIntoView({behavior: "smooth", block: "start"});
		}, 120);
	};

	return (
		<aside className={styles.detailsPanel}>
			{isHintsVisible && <button className={styles.panelToggleBtn} onClick={toggleOpen}>
				{
					detailsPanelOpen
						?"Hide (I)"
						// :`Узнать ${startsWithVowel(displayName) ?"об" :"о"} ${name(displayName)} (I)`
						:`Learn more about ${displayName} (I)`
				}
			</button>}

			{detailsPanelOpen && (
				<div className={styles.panelContent}>
					<div className={styles.bgPlanets}></div>
					<h2 className={styles.panelTitle}>
						{displayName}
						<small>{content.nickname}</small>
					</h2>

					<div className={styles.glossary}>
						{content.sections.map(section => {
							const title = section.title
							return (
								<button
									key={title}
									className={activeSection === title ?styles.activeGlossary :""}
									onClick={() => toggleSection(title)}
									aria-pressed={activeSection === title}
								>
									<span className={styles.glossaryTitle}>{title}</span>
								</button>
							)
						})}
					</div>

					<div className={styles.scrollArea} ref={scrollAreaRef}>
						{content.sections.map(section => {

							return (
								<div className={styles.section} id={`sect-${section.title}`} key={section.title}>
									<div
										className={styles.sectionHeader}
										onClick={() => toggleSection(section.title)}
										role="button"
										tabIndex={0}
									>
										<div className={styles.headerLeft}>
											<h3 className={styles.sectionTitle}>{section.title}</h3>
										</div>
										<div className={styles.headerRight}>
											<span className={styles.chev}>{activeSection === section.title ?"▾" :"▸"}</span>
										</div>
									</div>

									<div
										className={`${styles.sectionContent} ${activeSection === section.title ?styles.open :""}`}>
										{
											Array.isArray(section.text)
												?<ul>
													{section.text.map((it, i) => <li key={i}>{it}</li>)}
												</ul>
												: <p>{section.text}</p>
										}
									</div>
								</div>
							)
						})}
					</div>

					<DetailsMarquee items={content.marquee} />
				</div>
			)}
		</aside>
	);
};

export default DetailsPanel;