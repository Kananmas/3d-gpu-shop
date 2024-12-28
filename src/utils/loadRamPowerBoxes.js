import { degToRad } from "three/src/math/MathUtils.js";
import { products, productTypes } from "../index.data";
import { PorductMesh } from "../productMeshes/productMeshes";
import * as THREE from 'three'

export function loadMbPowerBoxes(scene ,  start = 0, end = 21, page = 0 , filterType = productTypes.MOTHERBOARD , setMaxPageNumber = () =>{}) {
    let meshesInstances = {};

    let x = 0;
    let y = 0;

    const filter = (item) => item.type == filterType;
    const firstFilter = products.filter(filter);
    const items = firstFilter.slice((start + end) * page, end * (page + 1))

    const seperator = filterType == productTypes.MOTHERBOARD ? 7:12
    setMaxPageNumber(Math.ceil( firstFilter.length / end));

    for (const product of items) {
        if (x % seperator == 0 && x > 0) {
            y += 0.55;
            x = 0;
        }

        const mesh = generateProductBox(product, x, y)
        mesh.name = product.id;
        const instance = new PorductMesh();

        instance.DefaultPosition.copy(mesh.position);
        instance.DefaultScale.copy(mesh.scale);
        instance.SelectPosition.copy(mesh.position.add(new THREE.Vector3(0, 0.04, 0)));
        instance.SelectScale = new THREE.Vector3(mesh.scale.x * 1.2, mesh.scale.y * 1.2, mesh.scale.z * 1.2)
        instance.Object = mesh;
        instance.Scene = scene

        instance.initialize();
        meshesInstances[product.id] = instance;

        x++;
    }


    return meshesInstances;
}

function generateProductBox(product, x, y) {
    const textureLoader = new THREE.TextureLoader();
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const texture = textureLoader.load(product.photo);
    const material = new THREE.MeshPhongMaterial({
        map: texture
    });


    const mesh = new THREE.Mesh(geometry, material)
    setProductBoxDimensions(mesh , product.type)

    mesh.rotation.y = degToRad(-20);
    setProductBoxPosition(product.type , mesh , x, y)

    return mesh;
}

function setProductBoxDimensions(mesh, type) {
    switch (type) {
        case productTypes.POWER:
            mesh.scale.set(0.2 * 1.2, 0.2, 0.2);
            return;
        case productTypes.MOTHERBOARD:
            mesh.scale.set(1 / 2, 0.6 / 1.57, 0.3 / 4)
            return;
        default:
            return;
    }
}

function setProductBoxPosition(productType, mesh , x , y) {
    const  zPos = 2.45;
    switch(productType) {
        case productTypes.POWER:
            mesh.position.y += 0.95;
            mesh.position.y += 1 - y;
            mesh.position.x = -3.4 + (mesh.scale.x + 0.22) * x - 4 * mesh.scale.x
            mesh.position.z = zPos
            return;
        case productTypes.MOTHERBOARD:
            mesh.position.y += 1.05;
            mesh.position.y += 1 - y;
            mesh.position.x = -2 + (mesh.scale.x + 0.22) * x - 4 * mesh.scale.x
            mesh.position.z = zPos
            return;
    }
}