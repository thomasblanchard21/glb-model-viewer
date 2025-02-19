import { camera } from "./sceneSetup.js";
import { setPlaybackSpeed, setAnimationFrame, toggleAnimation, setExposure } from "./eventHandler.js";
import { GUI } from "https://cdn.jsdelivr.net/npm/dat.gui@0.7.9/build/dat.gui.module.js";

export const gui = new GUI();
const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(camera.position, 'x', -10, 10);
cameraFolder.add(camera.position, 'y', -10, 10);
cameraFolder.add(camera.position, 'z', -10, 10);

const animationFolder = gui.addFolder('Animation');
animationFolder.add({toggle: toggleAnimation}, 'toggle').name('Pause/Play');
animationFolder.add({speed: 1}, 'speed', 0, 2).onChange(setPlaybackSpeed).name('Speed');
animationFolder.add({exposure: 1}, 'exposure', 0, 10).onChange(setExposure).name('Exposure');