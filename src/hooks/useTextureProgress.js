import {useState, useEffect} from "react";
import * as THREE from "three";

const useTextureProgress = (urls) => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		if (urls.length === 0) {
			setProgress(100);
			return;
		}

		let isCancelled = false;
		let loadedCount = 0;
		const loader = new THREE.TextureLoader();

		const loadTexture = (url) =>
			new Promise((resolve) => {
				loader.load(
					url,
					(texture) => {
						if (!isCancelled) {
							loadedCount++;
							setProgress(Math.floor((loadedCount / urls.length) * 100));
						}
						resolve(texture);
					},
					undefined,
					(error) => {
						console.error("Texture load error:", url, error);
						if (!isCancelled) {
							loadedCount++;
							setProgress(Math.floor((loadedCount / urls.length) * 100));
						}
						resolve(null);
					}
				);
			});

		Promise.all(urls.map(loadTexture));

		return () => {
			isCancelled = true;
		};
	}, [urls]);

	return {progress};
};

export default useTextureProgress;