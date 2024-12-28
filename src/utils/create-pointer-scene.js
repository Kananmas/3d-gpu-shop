import { Scene, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { degToRad } from "three/src/math/MathUtils.js";
import { Back, ReceptionView, SelectVitrin } from "../index.ui";

export const createPointerScene = function (scene = new Scene , anims = []) {
    const cameraPointName = 'camera-view-point'
    const gltfLoader = new GLTFLoader();
    const cameraPointCount = 4
    const points = [];
    const objects = [];
    const rots = [180, 0, 90];
    for (let i = 0; i < cameraPointCount; i++) {
        let name = i == 0 || i == 3 ? cameraPointName : cameraPointName + '00' + i;
        const object = scene.getObjectByName(name);
        points.push(object);
    }

    for (let i = 0; i < points.length; i++) {
        gltfLoader.load("../pointer.glb", (data) => {
            let objectScene = data.scene;

            let median = Math.ceil(points.length/2)
            objectScene.position.copy(points[i].position)



            objectScene.position.y = 0.2
            if (i < median) {
                objectScene.position.x = 0.5
                objectScene.rotation.y = degToRad(rots[i])
                objectScene.rotation.z = degToRad(90)
                objectScene.position.y += 0.5
            }
            else {
                objectScene.position.y = points[i].position.y + 1.0;
                objectScene.position.x += -1.6
                objectScene.rotation.z = degToRad(-90)
                objectScene.rotation.x = degToRad(-90)
            }
            const divide = 5;
            objectScene.scale.set(objectScene.scale.x / divide, 
                objectScene.scale.y / divide, objectScene.scale.z / divide)
            objectScene.children[0].name += i;
            objects.push(objectScene)
            function animate() {
                const firstPos = new Vector3();
                const zOffset = 0.1;
                firstPos.copy(objectScene.position);
                let dir = i%2 == 0 ? 1:-1;
                const getDirection = () => {
                    const inFirstPos = objectScene.position.equals(firstPos) || objectScene.position.distanceTo(firstPos) < 0.005;
                    const inSecondPos = objectScene.position.distanceTo(firstPos) >= zOffset;
                    if (inFirstPos) return 1;
                    if (inSecondPos) return -1;
                    return 0;
                }

                return () => {
                    const newDir = getDirection();
                    if (newDir != 0) {
                        dir = newDir;
                    }

                    objectScene.translateZ(dir * 0.0008)
                }

            }
            anims.push(animate())
            scene.add(objectScene)
        })
    }

    const hideAll = () => {
        scene.children = scene.children.filter(item => {
            return !objects.includes(item)
        })
    }

    const showAll = () => {
        objects.forEach(item => {
            if (scene.children.includes(item)) return;
            scene.add(item);
        })
    }

    window.addEventListener(SelectVitrin, hideAll)
    window.addEventListener(ReceptionView , hideAll)
    window.addEventListener(Back, showAll)
    window.addEventListener("ShowAll" , showAll)

    return scene;
}