import {Vector3} from "../../../three/src/math/Vector3";
import {UpdatebleInterface} from "../interfaces/UpdatebleInterface";
import {Mesh} from "../../../three/src/objects/Mesh";
import {SkinnedMesh} from "../../../three/src/objects/SkinnedMesh";
import {InstancedMesh} from "../../../three/src/objects/InstancedMesh";
import {CharacterObject} from "./CharacterObject";
import {UserInputService} from "../services/UserInputService";
import {Quaternion} from "../../../three/src/math/Quaternion";
import {RaycastService} from "../services/RaycastService";

export interface SpeedConfig {
    speed:number;
    acceleration:number;
    sprintSpeed:number;
    crouchSpeed:number;
    angularSpeed:number;
    jumpHeight:number;
    doubleJumpHeight:number;
    jumpAcceleration:number;
}

export class VelocityMove implements UpdatebleInterface{
    private direction:Vector3;
    private orientation:number = 0;
    private speed:number = 0;
    private character:CharacterObject;
    private config:SpeedConfig;
    private colliders:Array<Mesh|SkinnedMesh|InstancedMesh>;
    private prevDirection:Vector3;
    private prevPosition:Vector3;
    private desiredPosition:Vector3;

    public static get className():string {
        return './components/game/character/VelocityMove';
    }

    constructor(character:CharacterObject, config:SpeedConfig, colliders:Array<Mesh|SkinnedMesh|InstancedMesh>){
        this.character = character;
        this.config = config;
        this.colliders = colliders;

        this.orientation = character.bodyMesh.rotation.y;

        this.prevDirection = new Vector3();
        this.prevPosition = new Vector3();
        this.desiredPosition = new Vector3();
    }

    private updateDirection() {
        let state = UserInputService.Instance.playerState;

        this.prevDirection.copy(this.direction);

        if (state.forward) {
            this.direction.x = Math.sin(this.orientation);
            this.direction.z = Math.cos(this.orientation);
        } else if (state.backward) {
            this.direction.x = -Math.sin(this.orientation);
            this.direction.z = -Math.cos(this.orientation);
        } else {
            this.direction.x = 0;
            this.direction.z = 0;
        }

        if (state.jump || state.doubleJump) {
            this.direction.y = 1;
        } else {
            this.direction.y = 0;
        }
    }

    private updateMovement() {
        this.prevPosition.copy(this.character.bodyMesh.position);

        this.speed = this.config.speed;

        this.desiredPosition.copy(this.prevPosition);
        this.desiredPosition.x += this.direction.x * this.speed;
        this.desiredPosition.z += this.direction.z * this.speed;

        this.desiredPosition.y = RaycastService.Instance.getYFromRayDown(this.desiredPosition, () => {
            return this.colliders;
        });

        //TODO:перерасчёт скорости на основе ускорения/замедления и угла на склоне земли

        this.character.bodyMesh.position.copy(this.desiredPosition);
    }

    update(delta:number):void {
        this.updateDirection();
        this.updateMovement();
    }
}