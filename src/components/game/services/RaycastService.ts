import {Vector3} from "../../../three/src/math/Vector3";
import {Raycaster} from "../../../three/src/core/Raycaster";
import {Object3D} from "../../../three/src/core/Object3D";
import {Mesh} from "../../../three/src/objects/Mesh";
import {Group} from "../../../three/src/objects/Group";

/**
 * Сервис для работы с рэйкастером
 */
export class RaycastService {

    raycaster: Raycaster;

    private static _instance: RaycastService;

    private constructor() {
        this.raycaster = new Raycaster();
    }

    public static get Instance(): RaycastService {
        return this._instance || (this._instance = new this());
    }

    /**
     * Стрельнит лучём вниз от позиции {position} и добавит координату Y к {position}
     * взяв её из точки пересечения луча c {target}
     *
     */
    addYFromRayDown(position: Vector3, callbackMesh: (limit:number) => Array<Mesh|Group>): void {

        let targets = callbackMesh(9);

        this.raycaster.ray.origin.copy(position)
        this.raycaster.ray.direction.set(0, -1, 0)
        let intersects = this.raycaster.intersectObjects(targets, true)
        if (intersects.length > 0) {
            position.setY(intersects[0].point.y);
        } else {
            this.raycaster.ray.origin.copy(position)
            this.raycaster.ray.direction.set(0, 1, 0)
            let intersects = this.raycaster.intersectObjects(targets, true)
            if (intersects.length > 0) {
                position.setY(intersects[0].point.y);
            }
        }
    }

    /**
     * Стрельнит лучём вниз от позиции {position} и вернёт координату Y
     * взяв её из точки пересечения луча c {target}
     *
     */
    getYFromRayDown(position: Vector3, callbackMesh: () => Array<Mesh|Group>): number {

        let targets = callbackMesh();

        this.raycaster.ray.origin.copy(position)
        this.raycaster.ray.direction.set(0, -1, 0)
        let intersects = this.raycaster.intersectObject(targets[0], true)
        if (intersects.length > 0) {
            return intersects[0].point.y;
        } else {
            this.raycaster.ray.origin.copy(position)
            this.raycaster.ray.direction.set(0, 1, 0)
            let intersects = this.raycaster.intersectObject(targets[0], true)
            if (intersects.length > 0) {
                return intersects[0].point.y;
            }
        }
    }

}