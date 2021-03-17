import {Event} from "../../../three/src/core/EventDispatcher";

export class JoystickKeyUpEvent extends Event {
    static readonly type: string = 'JoystickKeyUp';
    code: string;
}