# Solar System 3D

Interactive 3D model of our solar system built with **React Three Fiber**.

## [Live Demo](https://ruslan-bekdev.github.io/Solar-System-3D/)

## Technologies
* **React 18** + **Vite**
* **Three.js** / **React Three Fiber** (R3F)
* **React Three Drei** (for controls and helpers)

## Challenges & Optimization
The main challenge was performance. High-resolution textures and complex 3D objects initially caused lags.

**What I did to make it better:**
* **Texture Prewarming:** Added a script to pre-load textures to the GPU. It helped a lot with smooth camera movement.
* **Optimization:** Adjusted shadows and light intensity to keep FPS stable even on mid-range laptops.
* **Navigation:** Built a focus system so you can "teleport" to planets using 1-8 keys.

*Note: There are still some minor lags during fast transitions, which I plan to fix by switching to compressed texture formats in the future.*

## How to run locally
1. `git clone https://github.com/Ruslan-bekdev/Solar-System-3D.git`
2. `npm install`
3. `npm run dev`