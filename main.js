import { initScene, animate } from "./sceneSetup.js";
import { setupEventHandlers } from './eventHandler.js'
import { loadModel } from "./modelLoader.js";

initScene();
setupEventHandlers();

const url = new URL(window.location.href);
const video = url.searchParams.get("video");
const model = url.searchParams.get("model");
if (model) loadModel(`https://huggingface.co/datasets/kinetix-testing/SMPL_arena_data/resolve/main/models/${model}/${video}.glb`);

animate();
