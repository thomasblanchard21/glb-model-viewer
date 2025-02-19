import { camera, renderer } from "./sceneSetup.js";
import { loadModel, removeModel, mixer, currentGltf } from "./modelLoader.js";

const container = document.getElementById( 'modelViewer' );

export function setupEventHandlers() {

    window.addEventListener("message", (event) => {
        switch (event.data.action) {
            case "loadModel":
                loadModel(event.data.modelUrl);
                break;
            case "setPlaybackSpeed":
                setPlaybackSpeed(event.data.speed);
                break;
            case "setAnimationFrame":
                setAnimationFrame(event.data.frame);
                break;
            case "toggleAnimation":
                toggleAnimation();
                break;
            case "playAnimation":
                playAnimation();
                break;
            case "pauseAnimation":
                pauseAnimation();
                break;
            case "removeModel":
                removeModel();
                break;
            case "setExposure":
                setExposure(event.data.exposure);
                break;
        }
    }, false);

    window.addEventListener( 'resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( container.clientWidth, container.clientHeight );
    });
}

function toggleAnimation() {
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

function setPlaybackSpeed(speed) {
    if (mixer && mixer.clipAction) {
        const action = mixer.clipAction(currentGltf.animations[0]);
        action.timeScale = speed;
    }
}

function setAnimationFrame(frame) {
    if (mixer) {
        mixer.setTime(frame / 60);
    }
}

function setExposure(value) {
    renderer.toneMappingExposure = value;
}