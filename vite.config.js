import {defineConfig} from 'vite';
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
	root: './',
	base: 'https://ruslan-bekdev.github.io/codenote/',
	build: {
		outDir: 'dist',
		sourcemap: true,
	},
	server: {
		port: 3000,
	},
	plugins: [react()],
});