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
        document.addEventListener('keydown', this.onKeyDown.bind(this), false)
        document.addEventListener('keyup', this.onKeyUp.bind(this), false)
    }

    private playerState:playerStateInterface;

    private keyDownArray:Array<string>;
    private keyUpArray:Array<string>;

    public static get Instance(): UserInputService {
        return this._instance || (this._instance = new this());
    }

    public getIsAnyKeyDown()
    {
        return this.anyKeyDown;
    }

    public getIsAnyKeyUp()
    {
        return this.anyKeyDown;
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

    private onKeyboardKeyDown(event:Event) {
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


    }

    private onKeyboardKeyUp(event:Event) {
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


    }


}