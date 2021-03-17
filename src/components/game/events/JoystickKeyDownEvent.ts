import {Event} from "../../../three/src/core/EventDispatcher";

export class JoystickKeyDownEvent extends Event {
    static readonly type: string = 'JoystickKeyDown';
    code: string;
}