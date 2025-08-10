import React, {useEffect} from 'react';
import {useLoader, useThree} from '@react-three/fiber';
import {TextureLoader, WebGLRenderTarget, LinearFilter, SRGBColorSpace} from 'three';

const Prewarm = ({
	                 textureUrls = [],
	                 frames,
	                 targetSize,
	                 onDone = () => {}
                 }) => {
	const textures = useLoader(TextureLoader, textureUrls.length ? textureUrls : []);
	const {gl, scene, camera} = useThree();

	useEffect(() => {
		let cancelled = false;

		const run = async () => {(textures || []).forEach(t => {
			if (!t) return;
			t.colorSpace = SRGBColorSpace;
			t.needsUpdate = true;
		});
			scene.traverse(obj => {
				if (obj.isMesh && obj.material){
					if (Array.isArray(obj.material))
						obj.material.forEach(m => (m.needsUpdate = true));
					else
						obj.material.needsUpdate = true;
				}
			});
			try{
				gl.compile(scene, camera);
			} catch (e){
				console.warn('failed', e);
			}
			const rt = new WebGLRenderTarget(targetSize, targetSize);
			rt.texture.minFilter = LinearFilter;
			for (let i = 0; i < frames && !cancelled; i++){
				gl.setRenderTarget(rt);
				gl.render(scene, camera);
			}
			gl.setRenderTarget(null);
			rt.dispose();

			if (!cancelled) onDone();
		};

		const id = setTimeout(run, 0);
		return () => {cancelled = true; clearTimeout(id);};
	}, [gl, scene, camera, textures, frames, targetSize, onDone]);

	return null;
}

export default Prewarm