import {Vector3} from "../../../three/src/math/Vector3";
import {UpdatebleInterface} from "../interfaces/UpdatebleInterface";
import {Mesh} from "../../../three/src/objects/Mesh";
import {SkinnedMesh} from "../../../three/src/objects/SkinnedMesh";
import {InstancedMesh} from "../../../three/src/objects/InstancedMesh";
import {CharacterObject} from "./CharacterObject";

export class VelocityMove implements UpdatebleInterface{
    private direction:Vector3;
    private character:CharacterObject;

    constructor(character:CharacterObject){
        this.character = character;
    }

    private updateDirection() {

    }

    private updateMovement() {

    }

    update(delta:number):void {
        this.updateDirection();
        this.updateMovement();
    }
}