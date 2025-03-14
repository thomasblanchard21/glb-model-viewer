import { camera, renderer } from "./sceneSetup.js";
import { loadModel, mixer, currentGltf } from "./modelLoader.js";

const container = document.getElementById( 'modelViewer' );

export function setupEventHandlers() {

    window.addEventListener("message", (event) => {
        console.log("Received event:", event.data);
        switch (event.data.action) {
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