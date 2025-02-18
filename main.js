import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { InfiniteGridHelper } from "./infiniteGrid.js"; // Import the custom grid

const container = document.getElementById( 'modelViewer' );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(2, 3, 7);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( container.clientWidth, container.clientHeight );
renderer.shadowMap.enabled = true;  // Enable Shadow Mapping
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft Shadows
renderer.setClearColor(0x000000, 0); // Transparent background
renderer.toneMapping = THREE.ReinhardToneMapping; // Exposure control
renderer.toneMappingExposure = 1.5;
container.appendChild( renderer.domElement );


const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Soft ambient light
scene.add(ambientLight);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(-10, 0, -10);
scene.add(backLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;  // Increase shadow resolution
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

const groundGeometry = new THREE.PlaneGeometry(40, 40);
const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.position.y = -0.01; // Lay flat on Y axis
ground.rotation.x = -Math.PI / 2; // Lay flat on XZ plane
ground.receiveShadow = true; // Shadows are cast onto this surface
scene.add(ground);

const infiniteGrid = new InfiniteGridHelper(1, 10, new THREE.Color(0x444444), 100);
scene.add(infiniteGrid);

const loader = new GLTFLoader();
let mixer;
let currentModel = null;

loader.load( './backflip.glb', function( gltf ) {
    const model = gltf.scene;

    model.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true; // Model should cast shadows
        }
    });

    scene.add( model );
    currentModel = model;

    // Create an AnimationMixer and play all animations
    mixer = new THREE.AnimationMixer( model );
    gltf.animations.forEach( ( clip ) => {
        mixer.clipAction( clip ).play();
    });
}, undefined, function( error ) {
    console.error( error );
});

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animate() {
    requestAnimationFrame( animate );

    // Update the animation mixer on each frame
    if ( mixer ) {
        mixer.update( 1 / 60 ); // Adjust the time scale as needed
    }

    controls.update(); // Update controls
    renderer.render( scene, camera );
}

// Handle window resize
window.addEventListener( 'resize', function() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( container.clientWidth, container.clientHeight );
});

animate();


// Function to handle commands from Gradio
window.viewerHandleCommand = function (data) {
    if (data.action === "loadModel") {
        loadModel(data.modelUrl);
    } else if (data.action === "setExposure") {
        setExposure(data.exposure);
    }
};

function loadModel(modelUrl) {
    if (!modelUrl) return;

    if (currentModel) {
        scene.remove(currentModel);
        currentModel = null; // Clear reference
    }

    // Load new model
    const loader = new GLTFLoader();
    loader.load(modelUrl, (gltf) => {
        let model = gltf.scene;
        model.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

        scene.add(model);
        currentModel = model;

        mixer = new THREE.AnimationMixer( model );
        gltf.animations.forEach( ( clip ) => {
            mixer.clipAction( clip ).play();
        });
    }, undefined, (error) => {
        console.error("Error loading model:", error);
    });
}


// Function to Adjust Exposure
function setExposure(value) {
    renderer.toneMappingExposure = value;
}


