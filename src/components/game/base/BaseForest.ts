import {DefaultGround} from "../grounds/DefaultGround";
import {InterfaceForestObject} from "./BaseMapObject";
import {LargeTree} from "../forest_objects/LargeTree";
import {Vector3} from "../../../three/src/math/Vector3";
import {BaseLevel} from "./BaseLevel";
import {MapPositionGeneratorService} from "../services/MapPositionGeneratorService";
import {Vector2} from "../../../three/src/math/Vector2";
import {Object3D} from "../../../three/src/core/Object3D";
import {Matrix4} from "../../../three/src/math/Matrix4";
import {Quaternion} from "../../../three/src/math/Quaternion";
import {InstancedMesh} from "../../../three/src/objects/InstancedMesh";
import {UpdatebleInterface} from "../interfaces/UpdatebleInterface";
import {CharacterObject} from "../character/CharacterObject";
import {Mesh} from "../../../three/src/objects/Mesh";
import {RaycastService} from "../services/RaycastService";
import {LargeStone} from "../forest_objects/LargeStone";
import {SmallTree} from "../forest_objects/SmallTree";

export interface CountConfig {
    largeTree: number;
    smallTree: number;
    largeStone: number;
}

export interface ForestInstancedEntry {
    mesh: Mesh;
    quaternion: Quaternion;
    scale: Vector3;
    positions: Array<Vector3>;
    _instancedMesh: InstancedMesh;
}

export class BaseForest implements UpdatebleInterface {
    level: BaseLevel;
    ground: DefaultGround;
    character: CharacterObject;
    countConfig: CountConfig = {
        largeTree: 350,
        smallTree: 0,
        largeStone: 100,
    };

    dataEntries: Array<ForestInstancedEntry> = [];

    _lastCharacterPosition: Vector3;
    _updateCount: number = 0;

    constructor(level: BaseLevel, ground: DefaultGround) {
        this.level = level;
        this.ground = ground;

        this.init();
        this.addForest();
    }

    init() {
        this.ground.mesh.geometry.computeBoundingBox();
    }

    addForest() {
        const tree = new LargeTree(this.level.renderer);
        tree.loadObject((forestObject: InterfaceForestObject) => {
            let coords = MapPositionGeneratorService.Instance.generate(this.ground, this.countConfig.largeTree);
            this.add(forestObject, coords);
        });

        const stone = new LargeStone(this.level.renderer);
        stone.loadObject((forestObject: InterfaceForestObject) => {
            let coords = MapPositionGeneratorService.Instance.generate(this.ground, this.countConfig.largeStone);
            this.add(forestObject, coords);
        });

        const tree1 = new SmallTree(this.level.renderer);
        tree1.loadObject((forestObject: InterfaceForestObject) => {
            let coords = MapPositionGeneratorService.Instance.generate(this.ground, this.countConfig.smallTree);
            this.add(forestObject, coords);
        });

    }

    add(forestObject: InterfaceForestObject, coords: Array<Vector2>): void {

        forestObject.objectGroup.traverse((child: Object3D) => {
            if (child.isMesh) {

                let quaternion = new Quaternion().setFromEuler(child.rotation);
                let scale = child.scale;

                let positions = [];
                coords.forEach((value: Vector2, index: number) => {
                    let position = new Vector3().copy(child.position).setX(value.x).setZ(value.y);
                    RaycastService.Instance.addYFromRayDown(position, this.ground.mesh);
                    positions.push(position);
                });

                let entry: ForestInstancedEntry = {
                    mesh: child,
                    positions: positions,
                    quaternion: quaternion,
                    scale: scale,
                };
                this.dataEntries.push(entry);

            }
        });
    }

    update(delta: number): void {
        this._updateCount++;

        if (!this.character.bodyMesh) {
            return;
        }
        let position = this.character.bodyMesh.position.clone();

        if(this._updateCount === 60) {
            this._updateCount = 0;
            this.computeEntries();
        }
        this._lastCharacterPosition = position;
    }

    computeEntries() {
        this.dataEntries.forEach((entry: ForestInstancedEntry, index: number) => {
            let positionCharacter = this._lastCharacterPosition;

            if (entry._instancedMesh) {
                this.level.scene.remove(entry._instancedMesh);
            }
            entry._instancedMesh = new InstancedMesh(entry.mesh.geometry, entry.mesh.material, this.countConfig.largeTree);
            entry._instancedMesh.receiveShadow = entry.mesh.receiveShadow
            entry._instancedMesh.castShadow = entry.mesh.castShadow

            let filteredPositions: Array<Vector3> = [];
            entry.positions.forEach((position: Vector3, index: number) => {
                if (this.getIsCharacterSee(position)) {
                    filteredPositions.push(position);
                }
            });

            entry._instancedMesh.count = filteredPositions.length;
            filteredPositions.forEach((position: Vector3, index: number) => {
                let matrix = new Matrix4();
                matrix.compose(
                    position,
                    entry.quaternion,
                    entry.scale,
                );
                entry._instancedMesh.setMatrixAt(index, matrix);
            });
            entry._instancedMesh.updateMatrixWorld();
            entry._instancedMesh.matrixWorldNeedsUpdate = false;

            this.level.scene.add(entry._instancedMesh);
        });
    }

    getIsCharacterSee(position: Vector3) {
        let positionCharacter = this._lastCharacterPosition;
        let distance = positionCharacter.distanceToSquared(position);
        if (distance < Math.pow(250, 2)) {
            return true;
        } else {
            return false;
        }
    }

}