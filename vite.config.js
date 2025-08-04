import {defineConfig} from 'vite';
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
	root: './',
	base: '/Solar-System-3D/',
	build: {
		outDir: 'dist',
		sourcemap: true,
	},
	server: {
		port: 5173,
	},
	plugins: [react()],
});