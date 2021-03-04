import {Vector3} from "../../../three/src/math/Vector3";
import {Mesh} from "../../../three/src/objects/Mesh";
import {BoxBufferGeometry} from "../../../three/src/geometries/BoxBufferGeometry";
import {MeshBasicMaterial} from "../../../three/src/materials/MeshBasicMaterial";
import {Color} from "../../../three/src/math/Color";
import {Scene} from "../../../three/src/scenes/Scene";
import {Group} from "../../../three/src/objects/Group";
import {InstancedMesh} from "../../../three/src/objects/InstancedMesh";
import {Object3D} from "../../../three/src/core/Object3D";

export interface InterfaceMapObject {

    /**
     * Кодовое имя объекта на карте
     */
    name:string;

    scale_coefficient:number;

    objectGroup: Group | Object3D | Mesh;
    /**
     * Ваш метод, который должен загрузить откуда-нибудь какой-нибудь объект и вызвать onLoad(this)
     */
    loadObject(onLoad: (mapObject: InterfaceMapObject) => void): void;

    /**
     * Ваш метод, который должен вернуть позицию объекта
     */
    getPosition(): Vector3;

    /**
     * Ваш метод, который должен выставить позицию объекту
     */
    setPosition(position: Vector3): void;

    /**
     * Ваш метод, который должен показать объект
     */
    show(): void;

    /**
     * Ваш метод, который должен скрыть объект
     */
    hide(): void;

    /**
     * Ваш метод должен добавить объект на сцену
     * @param scene
     */
    addToScene(scene: Scene):void;

    /**
     * Ваш метод должен убрать объект со сцены
     * @param scene
     */
    removeFromScene(scene: Scene):void;

    /**
     * Метод должен склонировать объект и далее работать с клоном
     */
    clone():void;
}

export interface callbackLoadInterface {

}

/**
 * Базовый класс для объекта на карте, в непереопределённом виде будет коробка
 */
export class BaseMapObject implements InterfaceMapObject {

    objectMesh: Group;
    scale_coefficient:number = 1;

    loadObject(onLoad: (forestObject: InterfaceMapObject) => void) {
        let mesh = new Mesh(
            new BoxBufferGeometry(25, 25, 25),
            new MeshBasicMaterial({
                color: new Color(0xff0000)
            }),
        );
        this.objectMesh = new Group();
        this.objectMesh.add(mesh);

        onLoad(this);
    }

    getPosition(): Vector3 {
        return this.objectMesh.position;
    }

    setPosition(position: Vector3): void {
        this.objectMesh.position.copy(position)
    }

    getOpacity(): number {
        return 1;
    }

    setOpacity(opacity: number): void {
    }

    addToScene(scene: Scene): void {
        scene.add(this.objectMesh);
    }

    removeFromScene(scene: Scene): void {
        scene.remove(this.objectMesh);
    }

    clone(){
        this.objectMesh = this.objectMesh.clone();
    }
}