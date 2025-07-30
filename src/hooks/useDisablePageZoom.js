import {useEffect} from "react";

const useDisablePageZoom = (active = true) => {
	useEffect(() => {
		if (!active) return;

		const onKeyDown = (e) => {
			if (e.ctrlKey || e.metaKey) {
				const key = e.key.toLowerCase();
				if (key === '+' || key === '=' || key === '-' || key === '_' || key === '0') {
					e.preventDefault();
				}
			}
		};

		const onWheel = (e) => {
			if (e.ctrlKey || e.metaKey) {
				e.preventDefault();
			}
		};

		const onGesture = (e) => {
			e.preventDefault();
		};

		window.addEventListener('keydown', onKeyDown, { passive: false });
		window.addEventListener('wheel', onWheel, { passive: false });

		window.addEventListener('gesturestart', onGesture, { passive: false });
		window.addEventListener('gesturechange', onGesture, { passive: false });
		window.addEventListener('gestureend', onGesture, { passive: false });

		return () => {
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('wheel', onWheel);
			window.removeEventListener('gesturestart', onGesture);
			window.removeEventListener('gesturechange', onGesture);
			window.removeEventListener('gestureend', onGesture);
		};
	}, [active]);
}

export default useDisablePageZoom;