import {BaseMapObject, InterfaceMapObject} from "../base/BaseMapObject";
import {Group} from "../../../three/src/objects/Group";
import {Scene} from "../../../three/src/scenes/Scene";
import {Vector3} from "../../../three/src/math/Vector3";
import {Object3D} from "../../../three/src/core/Object3D";
import {GLTF, GLTFLoader} from "../../../three/examples/jsm/loaders/GLTFLoader";
import {TextureLoader} from "../../../three/src/loaders/TextureLoader";
import {MeshPhongMaterial} from "../../../three/src/materials/MeshPhongMaterial";
import {DDSLoader} from "../../../three/examples/jsm/loaders/DDSLoader";
import {CompressedTexture} from "../../../three/src/textures/CompressedTexture";
import {
    DoubleSide, LinearEncoding,
    NormalBlending, sRGBEncoding
} from "../../../three/src/constants";
import {MeshBasicMaterial} from "../../../three/src/materials/MeshBasicMaterial";
import {MTLLoader} from "../../../three/examples/jsm/loaders/MTLLoader";
import {OBJLoader} from "../../../three/examples/jsm/loaders/OBJLoader";
import {Mesh} from "../../../three/src/objects/Mesh";
import {MeshService} from "../services/MeshService";

/**
 * Большая такая сосна красивая
 */
export class LargeTree extends BaseMapObject implements InterfaceMapObject {

    name: string = 'bigtree';
    scale_coefficient: number = 0.05;

    objectGroup: Group | Object3D | Mesh;

    loadObject(onLoad: (mapObject: InterfaceMapObject) => void) {
        let serv = MeshService.Instance;
        let loader = new GLTFLoader();
        loader.load('/models/bigtree/scene.gltf', (gltf: GLTF) => {
            this.objectGroup = serv.findLastParent(gltf.scene);

            this.objectGroup.castShadow = true;

            this.objectGroup.children[1].material.map.repeat.set(8,16);

            this.objectGroup.children[0].material.transparent = true;
            this.objectGroup.children[0].material.opacity = 0.95;

            onLoad(this);
        });
    }

    getPosition(): Vector3 {
        return this.objectGroup.position;
    }

    setPosition(position: Vector3): void {
        this.objectGroup.position.copy(position);
    }

    clone() {
        this.objectGroup = this.objectGroup.clone();
    }

    hide() {
        this.objectGroup.visible = false;
        this.objectGroup.matrixAutoUpdate = false;
    }

    show() {
        this.objectGroup.visible = true;
        this.objectGroup.matrixAutoUpdate = true;
    }
}