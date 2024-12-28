'use strict'

import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { degToRad, lerp } from "three/src/math/MathUtils.js";
import { injectLights } from "./utils/injectLights";
import {
    Back, currentSection,
    ProductView,
    ReceptionView,
    SectionSelected,
    SelectVitrin,
    setSections,
    ShopView,
    toggleReceptionView
} from "./index.ui";

// load functions
import { loadGpuCpuBoxes } from "./utils/loadCpuGpuBoxes";
import { products } from "./index.data";
import { loadMbPowerBoxes } from "./utils/loadRamPowerBoxes";
import { createPointerScene } from "./utils/create-pointer-scene";

export const viewModes = {
    DEFAULT: 'default',
    PREVIEW: 'preview',
    PRODUCTVIEW: 'product-view',
    RECEPTION:'reception',
}

export const shelfNames = {
    GPU_CPU_SHELF: 'GPUShelf',
    MB_POWER_SHELF: 'MotherBoardPowerShelf',
    RAM_CASE_SHELF: 'RamCaseShelf',
    RECEPTION: 'Reception',
    NO_SHELF: 'NoShelf'
}

let viewMode = 'default';
let selectedSection = '';
let productMeshes = {};
let pageNumber = 1;
let maxPageNumber = 0;

const setMaxPageNumber = (n) => {
    maxPageNumber = n;
}

const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const pageCounter = document.getElementById('page-counter');
const receptionViewBackBtn = document.getElementById('reception-view-back-btn')

const animateFunctions = [];


const shelf1 = ['Cube009_1', 'Cube011_1', 'Cube011', 'pointer1'];
const shelf2 = ['Cube007_1', 'Cube010_1', 'Cube010', 'pointer0'];
const shelf3 = ['Cube001_1', 'Cube001_2', 'pointer2'];
const reception = ['Cube006_1', 'Cube008'   , 'pointer3'];

const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true });

let currentHitObject = null;
let previousHitObject = null;

let travel = false;
let travelDestination = new THREE.Vector3();
let travelRotation = 0;
let origin = false;

let initialPosition = new THREE.Vector3();

injectLights(scene)


const travelTo = () => {
    if (travel) {
        camera.position.lerp(travelDestination, 0.015);
        camera.rotation.y = lerp(camera.rotation.y, travelRotation, 0.015);
        let dis = Math.abs(camera.rotation.y - travelRotation)
        const inPosition = camera.position.distanceTo(travelDestination) < 0.05;
        const inRotation = (camera.rotation.y == travelRotation || dis < 0.1);
        if (inPosition && inRotation) {
            camera.position.copy(travelDestination)
            camera.rotation.y = travelRotation;
            travel = false;
        }
    }
}


const loader = new GLTFLoader();
loader.load(`shop-env.glb`, function (data) {
    scene.add(data.scene)
    renderer.render(scene, camera)
    productMeshes = {
        [shelfNames.GPU_CPU_SHELF]: loadGpuCpuBoxes(scene),
        [shelfNames.MB_POWER_SHELF]: loadMbPowerBoxes(scene),
    }
    createPointerScene(scene, animateFunctions)
}, undefined, function (error) {
    console.log(error.message);
})


const vec2 = new THREE.Vector2();

const mouseRaycaster = (e) => {
    if (viewMode == viewModes.PRODUCTVIEW) return;
    vec2.x = (e.clientX / window.innerWidth) * 2 - 1;
    vec2.y = - (e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(vec2, camera);


    const intersections = raycaster.intersectObjects(scene.children);
    if (intersections.length) {
        if (currentHitObject == null || intersections[0].object.name != currentHitObject.object.name) {
            previousHitObject = currentHitObject;
            currentHitObject = intersections[0];
        }

        if (viewMode == viewModes.PREVIEW) {
            if (currentHitObject) {
                const section = productMeshes[selectedSection];
                let item = section[currentHitObject.object.name]
                let isProduct = item != undefined;
                if (isProduct) {
                    item.selectMode();
                    const ignore = Object.keys(section).indexOf(currentHitObject.object.name)
                    Object.values(section).forEach((item, i) => {
                        if (i != ignore) item.resetToDefault()
                    })
                }
                else {
                    Object.values(productMeshes[selectedSection]).forEach((item) => item.resetToDefault())
                }
            }
        }
        else {
            for (let section in productMeshes) {
                Object.values(productMeshes[section]).forEach((item) => item.resetToDefault())
            }
        }
    }

}


window.addEventListener('click', (e) => {
    if (viewMode == ProductView || currentHitObject == null) return;
    const targetName = currentHitObject.object.name;
    console.log(targetName);
    if (viewMode != viewModes.PREVIEW && viewMode != viewModes.RECEPTION) {

        if (reception.includes(targetName)) {
            goToReception();
            return;
        }

        if (shelf2.includes(targetName) || productMeshes?.[shelfNames.MB_POWER_SHELF]?.[targetName]) {
            setTravelPoint(['MOTHERBOARD', 'POWER'], 'camera-view-point', shelfNames.MB_POWER_SHELF, 180)
            return;
        }
        if (shelf1.includes(targetName) || productMeshes?.[shelfNames.GPU_CPU_SHELF]?.[targetName]) {
            setTravelPoint(['GPU', 'CPU'], 'camera-view-point001', shelfNames.GPU_CPU_SHELF, 0)
            return;
        }
        if (shelf3.includes(targetName)) {
            setTravelPoint(['RAM', 'SSD', 'HDD'], 'camera-view-point002', shelfNames.RAM_CASE_SHELF, 90)
            return;
        }
    }
    if (productMeshes?.[selectedSection]?.[targetName] && viewMode == viewModes.PREVIEW) {
        const productViewEvent = new Event(ProductView)
        productViewEvent.mesh = productMeshes[selectedSection][targetName].copy();
        productViewEvent.info = products.find(i => i.id == targetName)

        dispatchEvent(productViewEvent)
    }
});


renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

camera.position.set(3.4, 1.2, -0.8);
camera.rotation.y = degToRad(90);

initialPosition = new THREE.Vector3(3.4, 1.2, -0.8);

window.addEventListener('mousemove', mouseRaycaster)
window.addEventListener(Back, () => {
   resetPosition();
})

function resetPosition () {
    travelDestination.copy(initialPosition);
    travelRotation = degToRad(90);
    viewMode = viewModes.DEFAULT
    travel = true;
}

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight
})

function animate() {
    renderer.render(scene, camera);
    travelTo();
    animateFunctions.forEach(anim => anim())
}

window.addEventListener(ProductView, (e) => {
    viewMode = viewModes.PRODUCTVIEW;
})


window.addEventListener(ShopView, (e) => {
    viewMode = viewModes.PREVIEW;
})


window.addEventListener(SectionSelected, (e) => {
    filterChildren();
    const newSection = e.section;
    pageNumber = 1;
    pageCounter.innerText = pageNumber
    changeProductBoxes(newSection);
});

function filterChildren() {
    const removeObjects = Object.values(productMeshes[selectedSection]);
    removeObjects.forEach((item) => item.deleteSelf())
}

function setTravelPoint(items = [], cameraPoint = '', sectionName = '', rot = 0) {
    dispatchEvent(new Event(SelectVitrin));
    setSections(items)
    selectedSection = sectionName
    const target = scene.getObjectByName(cameraPoint);
    filterChildren();
    changeProductBoxes(items[0]);
    viewMode = viewModes.PREVIEW
    if (target) {
        travelDestination.copy(target.position);
        travelRotation = degToRad(rot)
        travel = true;
    }
}

function changeProductBoxes(targetCategory) {
    switch (selectedSection) {
        case shelfNames.GPU_CPU_SHELF:
            {
                const endNumber = targetCategory == 'GPU' ? 21 : 36
                productMeshes[shelfNames.GPU_CPU_SHELF] = loadGpuCpuBoxes(scene, 0, endNumber, pageNumber - 1,
                    targetCategory.toLowerCase(), setMaxPageNumber)
                return;
            }
        case shelfNames.MB_POWER_SHELF:
            {
                const endNumber = targetCategory == 'MOTHERBOARD' ? 21 : 41
                productMeshes[shelfNames.MB_POWER_SHELF] = loadMbPowerBoxes(scene, 0, endNumber, pageNumber - 1,
                    targetCategory.toLowerCase(), setMaxPageNumber)
                return;
            }
        case shelfNames.RAM_CASE_SHELF:
            return;
    }
}



prevButton.onclick = (e) => {
    if (pageNumber == 1) return;
    changePage(-1)
}


nextButton.onclick = (e) => {
    if (pageNumber == maxPageNumber) return;
    changePage(1)
}


const changePage = (add) => {
    pageNumber += add;
    filterChildren();
    changeProductBoxes(currentSection.name);
    pageCounter.innerText = pageNumber
}


function goToReception() {
    const target = scene.getObjectByName('camera-view-point');
    const targetPosition = new THREE.Vector3();
    targetPosition.copy(target.position);
    targetPosition.x += -1;
    targetPosition.y -= 0.2;
    targetPosition.z -= 0.4;
    selectedSection = shelfNames.RECEPTION
    viewMode = viewModes.RECEPTION;

    travelDestination.copy(targetPosition)
    travelRotation = degToRad(110);
    travel = true;
    toggleReceptionView();
    dispatchEvent(new Event(ReceptionView))
}



receptionViewBackBtn.addEventListener('click' , () => {
    resetPosition();
    toggleReceptionView()
    dispatchEvent(new Event("ShowAll"))
})
