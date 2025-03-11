import { initScene, animate } from "./sceneSetup.js";
import { setupEventHandlers } from './eventHandler.js'
import { loadModel } from "./modelLoader.js";

initScene();
setupEventHandlers();

const url = new URL(window.location.href);
const model = url.searchParams.get("model");
if (model) loadModel(`https://gradio-model-viewer.s3.eu-west-1.amazonaws.com/models/${model}.glb`);

animate();
