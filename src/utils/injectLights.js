import * as THREE from "three"

export function injectLights(scene) {
    const light = new THREE.PointLight();
    light.scale.set(2, 2, 2)
    light.position.set(-0.64, 1.2, -1.08)
    light.intensity = 12;
    scene.add(light)

    const light2 = new THREE.PointLight();
    light2.scale.set(2, 2, 2);
    light2.intensity = 5;
    light2.position.set(-1.27, 1.5, 1.68)
    scene.add(light2)


    const light3 = new THREE.PointLight();
    light3.scale.set(2, 2, 2);
    light3.intensity = 5;
    light3.position.set(-1.2, 1.5, -3.10)
    scene.add(light3)

    const light4 = new THREE.PointLight();
    light4.scale.set(2, 2, 2)
    light4.position.set(2.6, 1.2, 0.38)
    light4.intensity = 4;
    scene.add(light4);


    const light5 = new THREE.PointLight();
    light5.scale.set(2, 2, 2)
    light5.position.set(-4.82, 1.6, -2.22)
    light5.intensity = 8;
    scene.add(light5)
}