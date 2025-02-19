import { camera, renderer } from "./sceneSetup.js";
import { loadModel, removeModel, mixer, currentGltf, currentModel } from "./modelLoader.js";

const container = document.getElementById( 'modelViewer' );

export function setupEventHandlers() {

    window.addEventListener("message", (event) => {
        switch (event.data.action) {
            case "loadModel":
                loadModel(event.data.modelUrl).then(() => {
                    window.dispatchEvent(new Event("modelLoaded"));
                }).catch((error) => {
                    console.error("Error loading model:", error);
                });
                break;
            case "setPlaybackSpeed":
                setPlaybackSpeed(event.data.speed);
                break;
            case "setAnimationFrame":
                waitForModel().then(setAnimationFrame(event.data.frame));
                break;
            case "toggleAnimation":
                waitForModel().then(toggleAnimation());
                break;
            case "playAnimation":
                waitForModel().then(playAnimation());
                break;
            case "pauseAnimation":
                waitForModel().then(pauseAnimation());
                break;
            case "removeModel":
                removeModel();
                break;
            case "setExposure":
                setExposure(event.data.exposure);
                break;
            default:
                console.error("Unknown action:", event.data.action);
        }
    }, false);

    window.addEventListener( 'resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( container.clientWidth, container.clientHeight );
    });
}

function waitForModel() {
    return new Promise((resolve) => {
        if (currentModel) {
            resolve();
            return;
        }

        window.addEventListener("modelLoaded", () => resolve(), { once: true });
    });
}

export function toggleAnimation() {
    if (mixer && mixer.clipAction) {
        const action = mixer.clipAction(currentGltf.animations[0]);
        action.paused = !action.paused;
    }
}

function playAnimation() {
    if (mixer && mixer.clipAction) {
        const action = mixer.clipAction(currentGltf.animations[0]);
        if (action.paused) {
            action.paused = false;
        }
    }
}

function pauseAnimation() {
    if (mixer && mixer.clipAction) {
        const action = mixer.clipAction(currentGltf.animations[0]);
        if (!action.paused) {
            action.paused = true;
        }
    }
}

export function setPlaybackSpeed(speed) {
    if (mixer && mixer.clipAction) {
        const action = mixer.clipAction(currentGltf.animations[0]);
        action.timeScale = speed;
    }
}

export function setAnimationFrame(frame) {
    if (mixer) {
        mixer.setTime(frame / 60);
    }
}

export function setExposure(value) {
    renderer.toneMappingExposure = value;
}