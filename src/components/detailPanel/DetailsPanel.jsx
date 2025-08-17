import React from "react";
import styles from "./detailPanel.module.less";

const DetailsPanel = ({focusRef, detailsPanelOpen, setDetailsPanelOpen}) => {
	const displayName = focusRef.name || 'Солнце';
	const toggleOpen = () => {
		setDetailsPanelOpen(prevState => !prevState);
	}

	const startsWithVowel = (text) => {
		return /^[аеёиоуыэюя]/i.test(text);
	}
	const name = (name) => {
		let newName = name
		if (/й$/i.test(name)) return newName = name.slice(0,-1) + 'и';
		if (/[аеёиоуыэюя]$/i.test(name)) return newName = name.slice(0,-1) + 'е';
		else return newName + 'е';
	}

	return (
		<aside className={styles.detailsPanel} aria-label="Информация об объекте">
			<button onClick={toggleOpen} aria-expanded={detailsPanelOpen}>
				{detailsPanelOpen
					?'Скрыть (I)'
					:`Узнать ${startsWithVowel(displayName) ?'об' :'о'} ${name(displayName)} (I)`
				}
			</button>

			{detailsPanelOpen && (
				<div className={styles.panelContent}>
					<h2>{displayName}</h2>
					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores atque doloremque ea esse eveniet fugit illum iusto modi molestias neque perspiciatis, quos rem repellendus? Error excepturi facere inventore iusto nesciunt?</p>
				</div>
			)}
		</aside>

	)
}

export default DetailsPanel;