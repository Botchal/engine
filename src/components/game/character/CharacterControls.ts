import {UpdatebleInterface} from "../interfaces/UpdatebleInterface";
import {Mesh} from "../../../three/src/objects/Mesh";
import {Raycaster} from "../../../three/src/core/Raycaster";
import {MathUtils} from "../../../three/src/math/MathUtils";
import {Scene} from "../../../three/src/scenes/Scene";
import {CharacterObject} from "./CharacterObject";
import {RaycastService} from "../services/RaycastService";
import {Vector3} from "../../../three/src/math/Vector3";
import {Group} from "../../../three/src/objects/Group";
import nipplejs from 'nipplejs';
import * as MobileDetect from 'mobile-detect';
import {CharacterCamera} from "./CharacterCamera";

export interface CharacterControlsInterface {

}

export class CharacterControls implements CharacterControlsInterface, UpdatebleInterface {
    character: CharacterObject;
    callbackMesh: () => Array<Mesh|Group>
    scene: Scene;
    raycaster: Raycaster;

    controls = {
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
        crouch: false,
        jump: false,
    };

    config = {
        maxSpeed: 3,
        maxReverseSpeed: -10,
        walkSpeed: 0.8,
        crouchSpeed: 0.2,
        angularSpeed: 0.075,
        jumpHeight: 20,
        doubleJumpInterval: 250,//ms
    };

    //состояния движения
    speed = 0;
    speedModifier = 0;
    bodyOrientation = 0;
    frontAcceleration = 600;
    backAcceleration = 600;
    frontDecceleration = 600;
    jumpStart = false;
    jumpPeak = false;
    jumpFinish = true;
    jumpDouble = false;
    jumpCoord: Vector3;
    lastRequestJumpTime = 0;

    private charCamera:CharacterCamera;

    private onMove;
    /**
     * onMove будет вызываться не в каждом фрейме а только каждые N фреймов
     */
    readonly framePerCallOnMove = 1;
    private _fpcCount = 0;

    private last_position: Vector3;
    private last_y_pos:number;

    constructor(character: CharacterObject, callbackMesh: () => Array<Mesh|Group>, scene: Scene, charCamera:CharacterCamera, onMove) {
        this.character = character
        this.callbackMesh = callbackMesh
        this.charCamera = charCamera
        this.scene = scene
        this.raycaster = new Raycaster()
        this.onMove = onMove;
        this.last_position = new Vector3();

        document.addEventListener('keydown', this.onKeyDown.bind(this), false)
        document.addEventListener('keyup', this.onKeyUp.bind(this), false)

        let md = new MobileDetect(window.navigator.userAgent);

        if (md.mobile()) {

            this.config.angularSpeed = 0.035;

            let joystick = nipplejs.create({
                zone: document.getElementById('static'),
                mode: 'static',
                position: {left: '90%', top: '90%'},
                color: 'red'
            });


            joystick.on('end', (evt, data) => {
                document.dispatchEvent(new KeyboardEvent('keyup', {'keyCode': 38}));
                document.dispatchEvent(new KeyboardEvent('keyup', {'keyCode': 40}));
                document.dispatchEvent(new KeyboardEvent('keyup', {'keyCode': 37}));
                document.dispatchEvent(new KeyboardEvent('keyup', {'keyCode': 39}));
            });

            joystick.on('move', (evt, data) => {
                console.log(data);
                if (data.direction && data.direction.y === 'up') {
                    document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': 38}));
                } else if (data.direction && data.direction.y === 'down') {
                    document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': 40}));
                }

                if (data.angle && data.angle.degree >= 110) {
                    document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': 37}));
                } else if (data.angle && data.angle.degree <= 70) {
                    document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': 39}));
                } else {
                    document.dispatchEvent(new KeyboardEvent('keyup', {'keyCode': 37}));
                    document.dispatchEvent(new KeyboardEvent('keyup', {'keyCode': 39}));
                }

            });
        }

    }


    onKeyDown(event) {
        switch (event.keyCode) {
            case 38: /*up*/
            case 87: /*W*/
                this.controls.moveForward = true
                break

            case 40: /*down*/
            case 83: /*S*/
                this.controls.moveBackward = true
                break

            case 37: /*left*/
            case 65: /*A*/
                this.controls.moveLeft = true
                break

            case 39: /*right*/
            case 68: /*D*/
                this.controls.moveRight = true
                break

            case 67:
                this.controls.crouch = true
                break
            case 32:
                this.controls.jump = true
                break

        }

    }

    onKeyUp(event) {
        switch (event.keyCode) {

            case 38: /*up*/
            case 87: /*W*/
                this.controls.moveForward = false
                break

            case 40: /*down*/
            case 83: /*S*/
                this.controls.moveBackward = false
                break

            case 37: /*left*/
            case 65: /*A*/
                this.controls.moveLeft = false
                break

            case 39: /*right*/
            case 68: /*D*/
                this.controls.moveRight = false
                break

            case 67:
                this.controls.crouch = false
                break
            case 32:
                this.controls.jump = false
                break

        }

    }

    slideDown() {

    }

    updateMovement(delta) {

        //console.log(delta);
        let _delta = delta
        delta = 1;

        if (this.controls.crouch) {
            this.config.maxSpeed = this.config.crouchSpeed
        } else {
            this.config.maxSpeed = this.config.walkSpeed - this.speedModifier
            if (this.config.maxSpeed < 0) {
                this.slideDown();
            }
        }

        if (this.speed > 0) {
            //console.log(this.config.walkSpeed, this.speedModifier);
        }

        if (this.controls.moveForward && !this.jumpStart) {
            console.log(this.speedModifier);
            this.speed = MathUtils.clamp(this.speed + delta * this.frontAcceleration, this.config.maxReverseSpeed, this.config.maxSpeed)
        }

        if (this.controls.moveBackward && !this.jumpStart) {
            this.speed = MathUtils.clamp(this.speed - delta * this.backAcceleration, this.config.maxReverseSpeed, this.config.maxSpeed)
        }

        var dir = 1

        if (this.controls.moveLeft) {
            this.bodyOrientation += this.config.angularSpeed
            if (!(this.controls.moveForward || this.controls.moveBackward)) {
                this.speed = MathUtils.clamp(this.speed + dir * 0.001 * this.frontAcceleration, this.config.maxReverseSpeed, this.config.maxSpeed / 2)
            }
        }

        if (this.controls.moveRight) {
            this.bodyOrientation -= this.config.angularSpeed
            if (!(this.controls.moveForward || this.controls.moveBackward)) {
                this.speed = MathUtils.clamp(this.speed + dir * 0.001 * this.frontAcceleration, this.config.maxReverseSpeed, this.config.maxSpeed / 2)
            }
        }

        if (!(this.controls.moveForward || this.controls.moveBackward) && !this.jumpStart) {

            let k = 0
            if (this.speed > 0) {
                k = this.exponentialEaseOut(this.speed / this.config.maxSpeed)
                this.speed = MathUtils.clamp(this.speed - k * 0.00007 * this.frontDecceleration, 0, this.config.maxSpeed)
            } else {
                k = this.exponentialEaseOut(this.speed / this.config.maxReverseSpeed)
                this.speed = MathUtils.clamp(this.speed + k * 0.00007 * this.backAcceleration, 0, this.config.maxReverseSpeed)
            }
            if (this.speed !== 0) {
                this.updateGroundPosition(_delta)
            }

        }

        if ((this.controls.moveForward || this.controls.moveBackward) && this.speed !== 0 && !this.jumpStart) {
            this.updateGroundPosition(_delta)
        }

        this.character.bodyMesh.position.x += Math.sin(this.bodyOrientation) * this.speed
        this.character.bodyMesh.position.z += Math.cos(this.bodyOrientation) * this.speed

        if (this.controls.jump) {
            if (!this.jumpStart && this.jumpFinish) {
                this.jumpStart = true;
                this.jumpCoord = new Vector3().copy(this.character.bodyMesh.position);
            }
            let currentTime = Date.now();
            if (this.lastRequestJumpTime !== 0 && this.jumpStart && currentTime > this.lastRequestJumpTime + this.config.doubleJumpInterval) {
                this.config.jumpHeight = 40;
            } else if (this.lastRequestJumpTime === 0 && this.jumpStart) {
                this.lastRequestJumpTime = currentTime;
            }
        }
        this.updateJumpPosition();


        this.character.bodyMesh.rotation.y = this.bodyOrientation;

        document.getElementById('position-x-value').innerText = this.character.bodyMesh.rotation.x;
        document.getElementById('position-z-value').innerText = this.character.bodyMesh.rotation.z;
        document.getElementById('position-y-value').innerText = this.character.bodyMesh.rotation.y;

    }

    exponentialEaseOut(k: number) {
        return k === 1 ? 1 : -Math.pow(2, -30 * k) + 1;

    }

    updateJumpPosition() {
        if (this.jumpStart && !this.jumpPeak) {
            if (this.character.bodyMesh.position.y - this.jumpCoord.y < this.config.jumpHeight) {
                this.speed = this.config.maxSpeed * 2;
                this.character.bodyMesh.position.y += 1;
            } else {
                this.jumpPeak = true;
                this.lastRequestJumpTime = 0;
            }
        }

        if (this.jumpStart && this.jumpPeak) {
            let landingY = RaycastService.Instance.getYFromRayDown(this.character.bodyMesh.position, this.callbackMesh)
            if (landingY < this.character.bodyMesh.position.y - 1.2) {
                this.character.bodyMesh.position.y -= 1.2;
            } else {
                this.speed = this.config.maxSpeed * 1.5;
                this.jumpStart = false;
                this.jumpPeak = false;
                this.jumpFinish = true;
            }
        }

        if (!this.jumpStart && this.jumpFinish) {
            this.config.jumpHeight = 20;
            this.lastRequestJumpTime = 0;
        }
    }

    updateGroundPosition(delta:number) {
        RaycastService.Instance.addYFromRayDown(this.character.bodyMesh.position, this.callbackMesh);

        if (this.last_y_pos) {
            this.speedModifier = (this.character.bodyMesh.position.y - this.last_y_pos);
        }

        this.last_y_pos = this.character.bodyMesh.position.y;
    }

    update(delta) {
        this.updateMovement(delta)

        if (
            this.last_position.x !== this.character.bodyMesh.position.x
            || this.last_position.z !== this.character.bodyMesh.position.z
            || this.last_position.y !== this.character.bodyMesh.position.y
        ) {
            if (this._fpcCount < this.framePerCallOnMove) {
                this._fpcCount++;
            } else {
                this._fpcCount = 0;
                this.onMove(this);
            }
        }

        this.last_position.copy(this.character.bodyMesh.position);

        document.getElementById('position-x-value').innerText = this.character.bodyMesh.position.x;
        document.getElementById('position-z-value').innerText = this.character.bodyMesh.position.z;
        document.getElementById('position-y-value').innerText = this.character.bodyMesh.position.y;
    }
}

