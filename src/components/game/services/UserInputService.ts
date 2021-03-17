import {JoystickMoveEvent} from "../events/JoystickMoveEvent";
import {JoystickKeyUpEvent} from "../events/JoystickKeyUpEvent";
import {JoystickKeyDownEvent} from "../events/JoystickKeyDownEvent";

export interface playerStateInterface {
    forward:boolean,
    backward:boolean,
    angle:number,
    crouch:boolean,
    jump:boolean,
    sprint:boolean,
    action:boolean,
}

export class UserInputService {
    private static _instance: UserInputService;

    private constructor() {
        document.addEventListener('keydown', this.onKeyDown.bind(this), false);
        document.addEventListener('keyup', this.onKeyUp.bind(this), false);

        document.addEventListener(JoystickKeyDownEvent.type, this.onKeyDown.bind(this), false);
        document.addEventListener(JoystickKeyUpEvent.type, this.onKeyUp.bind(this), false);

        document.addEventListener(JoystickMoveEvent.type, this.onJoystickMove.bind(this), false);
    }

    readonly playerState:playerStateInterface;

    private keyDownArray:Array<string>;
    private keyUpArray:Array<string>;

    public static get Instance(): UserInputService {
        return this._instance || (this._instance = new this());
    }

    public getIsAnyKeyDown()
    {
        return this.keyDownArray.length > 0;
    }

    public getIsAnyKeyUp()
    {
        return this.keyUpArray.length > 0;
    }

    public getIsKeyDown(keyCode:string) {
        if(this.keyDownArray.indexOf(keyCode) != -1) {
            return true;
        }
    }

    public getIsKeyUp(keyCode:string) {
        if(this.keyUpArray.indexOf(keyCode) != -1) {
            return true;
        }
    }

    public getUpKeyboardButton():Array<string> {
        return this.keyUpArray;
    }

    public getDownKeyboardButton():Array<string> {
        return this.keyDownArray;
    }

    private onJoystickMove(event:JoystickMoveEvent) {
        if (event.direction === JoystickMoveEvent.DIRECTION_FORWARD) {
            this.playerState.forward = true;
            this.playerState.backward = false;
        } else if (event.direction === JoystickMoveEvent.DIRECTION_BACKWARD) {
            this.playerState.backward = true;
            this.playerState.forward = false;
        }
        this.playerState.angle = event.angle;
    }

    private onKeyDown(event:Event|JoystickKeyDownEvent) {
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
            case 'Numpad8':
                this.playerState.forward = true;
                break;

            case 'KeyS':
            case 'ArrowDown':
            case 'Numpad2':
            case 'Numpad5':
                this.playerState.forward = true;
                break;

            case 'KeyD':
            case 'ArrowRight':
            case 'Numpad6':
                this.playerState.angle = 0;
                break;

            case 'KeyA':
            case 'ArrowLeft':
            case 'Numpad4':
                this.playerState.angle = 180;
                break;

            case 'KeyC':
                this.playerState.crouch = true;
                break;

            case 'Space':
            case 'Numpad0':
                this.playerState.jump = true;
                break;

            case 'ShiftLeft':
            case 'ShiftRight':
                this.playerState.sprint = true;
                break;

            case 'KeyE':
            case 'NumpadMultiply':
                this.playerState.action = true;
                break;
        }

        let indexDown = this.keyDownArray.indexOf(event.code);
        let indexUp = this.keyDownArray.indexOf(event.code);

        if(indexDown === -1) {
            this.keyDownArray.push(event.code);
        }

        if(indexUp !== -1) {
            this.keyUpArray.splice(indexUp, 1);
        }
    }

    private onKeyUp(event:Event|JoystickKeyUpEvent) {
        switch (event.code) {

            case 'KeyW':
            case 'ArrowUp':
            case 'Numpad8':
                this.playerState.forward = false;
                break;

            case 'KeyS':
            case 'ArrowDown':
            case 'Numpad2':
            case 'Numpad5':
                this.playerState.forward = false;
                break;

            case 'KeyD':
            case 'ArrowRight':
            case 'Numpad6':
                this.playerState.angle = 90;
                break;

            case 'KeyA':
            case 'ArrowLeft':
            case 'Numpad4':
                this.playerState.angle = 90;
                break;

            case 'KeyC':
                this.playerState.crouch = false;
                break;

            case 'Space':
            case 'Numpad0':
                this.playerState.jump = false;
                break;

            case 'ShiftLeft':
            case 'ShiftRight':
                this.playerState.sprint = false;
                break;

            case 'KeyE':
            case 'NumpadMultiply':
                this.playerState.action = false;
                break;

        }

        let indexUp = this.keyDownArray.indexOf(event.code);
        let indexDown = this.keyDownArray.indexOf(event.code);

        if(indexUp === -1) {
            this.keyUpArray.push(event.code);
        }

        if(indexDown !== -1) {
            this.keyDownArray.splice(indexDown, 1);
        }
    }


}