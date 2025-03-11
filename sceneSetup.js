import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { InfiniteGridHelper } from "./infiniteGrid.js";
import { updateAnimation } from './modelLoader.js';

const container = document.getElementById( 'modelViewer' );

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 100);
export const renderer = new THREE.WebGLRenderer({ antialias: true });
export const controls = new OrbitControls(camera, renderer.domElement);

export function initScene() {
    
    window.viewerState = {
        paused: false,
        currentFrame: 0,
        playbackSpeed: 1.0,
        exposure: 1.5,
        model: null,
        cameraPosition: { x: 2, y: 3, z: 7 },
        gridSize: 10
    };    

    camera.position.set(2, 3, 7);

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

    controls.enableDamping = true;
}

export function animate() {
    requestAnimationFrame( animate );

    updateAnimation(window.viewerState.playbackSpeed / 60); // 60 FPS

    controls.update();  
    renderer.render( scene, camera );
}
