import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { scene, camera, renderer } from "./sceneSetup.js";

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

        const loadingManager = new THREE.LoadingManager();

        loadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {
            console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        }

        loadingManager.onLoad = function ( ) {
            console.log( 'Loading complete!');
        }

        loadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
            console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        }

        loadingManager.onError = function ( url ) {
            console.log( 'There was an error loading ' + url );
        }

        console.log("Before:", scene.children);

        const loader = new GLTFLoader(loadingManager);
        loader.load(modelUrl, async function (gltf) {
            currentGltf = gltf;
            const model = gltf.scene;
            model.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });

            currentModel = model;
            await renderer.compile( model, camera, scene );
            scene.add(model);

            if (gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(currentModel);
                const action = mixer.clipAction(gltf.animations[0]);
                action.play();
            }

            console.log("After:", scene.children);

            resolve();
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