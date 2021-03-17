import {Event} from "../../../three/src/core/EventDispatcher";

export class JoystickMoveEvent extends Event {

    static readonly DIRECTION_FORWARD: number = 1;
    static readonly DIRECTION_BACKWARD: number = 2;

    static readonly type: string = 'JoystickMove';

    direction: number;
    angle: number;
    force: number;
}