import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { scene } from "./sceneSetup.js";

export let mixer = null;
export let currentGltf = null;
export let currentModel = null;

export function loadModel(modelUrl) {
    return new Promise((resolve, reject) => {
        if (!modelUrl) {
            reject("No model URL provided");
            return;
        }

        removeModel();

        console.log("Loading model: ", modelUrl);
        const loader = new GLTFLoader();
        loader.load(modelUrl, (gltf) => {
            currentGltf = gltf;
            let model = gltf.scene;
            model.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });

            currentModel = model;
            scene.add(model);

            if (gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(currentModel);
                const action = mixer.clipAction(gltf.animations[0]);
                action.play();
            }

            resolve(model);
        },
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        undefined, (error) => {
            console.error("Error loading model:", error);
            reject(error);
        });
    });
}

export function removeModel() {
    if (currentModel) {
        scene.remove(currentModel);
        currentModel.traverse((node) => {
            if (node.isMesh) {
                node.geometry.dispose();
                node.material.dispose();
            }
        });
        currentModel = null;
        mixer = null;
    }
}

export function updateAnimation(deltaTime) {
    if (mixer) {
        mixer.update(deltaTime);
    }
}