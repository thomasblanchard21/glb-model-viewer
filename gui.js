import { camera } from "./sceneSetup";
import { setPlaybackSpeed, setAnimationFrame, toggleAnimation, setExposure } from "./eventHandler";

export const gui = new dat.GUI();
const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(camera.position, 'x', -10, 10);
cameraFolder.add(camera.position, 'y', -10, 10);
cameraFolder.add(camera.position, 'z', -10, 10);

const animationFolder = gui.addFolder('Animation');
animationFolder.add({toggle: toggleAnimation}, 'toggle').name('Pause/Play');
animationFolder.add({speed: 1}, 'speed', 0, 2).onChange(setPlaybackSpeed).name('Speed');
animationFolder.add({exposure: 1}, 'exposure', 0, 10).onChange(setExposure).name('Exposure');