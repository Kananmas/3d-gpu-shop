import * as THREE from 'three';
import { degToRad } from 'three/src/math/MathUtils.js';
import { ProductView } from './index.ui';
import { createProductInfo } from './utils/createProductInfo';
import Swal from 'sweetalert2'


const mountTarget = document.getElementById('main-product-view');
const addToCartBtn = document.getElementById('product-view-add');
const removeBtn = document.getElementById('product-view-remove');

let viewObject = null;
let info = null;

const stdWidth = 0.6 * window.innerWidth;
const stdHeight = window.innerHeight
let canrotate = false;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, stdWidth / stdHeight, 0.1, 1000);

const pointLight = new THREE.PointLight(0x00ff00, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(stdWidth, stdHeight);
renderer.setAnimationLoop(animate);
mountTarget.appendChild(renderer.domElement);

scene.add(pointLight);

camera.position.z += 5;
camera.position.y = 2
camera.rotation.x = degToRad(-20)

pointLight.position.copy(camera.position)

function animate() {
    renderer.render(scene, camera);
}

mountTarget.addEventListener('mousedown', (e) => {
    canrotate = true;
})

mountTarget.addEventListener('mouseup', (e) => {
    canrotate = false;
})

mountTarget.addEventListener('mousemove', (e) => {
    if (canrotate) {
        viewObject.rotation.y += e.movementX * 0.01
        viewObject.rotation.z -= e.movementY * 0.01
    }
})

window.addEventListener(ProductView, (e) => {
    scene.children = [];
    const photo = e.info.photo;
    info = e.info;
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(photo);
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const texutreMaterial = new THREE.MeshBasicMaterial({
        map: texture,
    })
    const mesh = new THREE.Mesh(geometry, texutreMaterial)
    const multiplyer = 7;
    mesh.scale.set(e.mesh.Object.scale.x * multiplyer, e.mesh.Object.scale.y * multiplyer, e.mesh.Object.scale.z * multiplyer)

    viewObject = mesh;
    scene.add(mesh)

})


window.addEventListener(ProductView, (e) => {
    const productInfoEl = document.getElementById('info-view-about');
    const productInfo = createProductInfo(e.info);
    productInfoEl.innerHTML = productInfo;
});


addToCartBtn.onclick = () => {
    const str = localStorage.getItem('cart');
    let products = [];
    if (str) {
        products = JSON.parse(str);
    }
    products.push({ name: info.name, price: info.price, category: info.type, id: info.id })
    localStorage.setItem('cart', JSON.stringify(products));
    Swal.fire({
        text:'Product Added To Your Cart',
        confirmButtonText:"OK",
        icon:'success'
    })
}

removeBtn.onclick = () => {
    const str = localStorage.getItem('cart');
    if (!str) {
        Swal.fire({
            text:'Cart Is Empty',
            confirmButtonText:'OK',
            icon:"error"
        })
        return;
    }
    let products = JSON.parse(str);
    products = products.filter((item) => item.id !== info.id);

    localStorage.setItem('cart', JSON.stringify(products))
    Swal.fire({
        text:'Item Removed From Cart',
        confirmButtonText:'OK',
        icon:'success'
    })
}