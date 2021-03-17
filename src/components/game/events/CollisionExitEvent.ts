import {Event} from "../../../three/src/core/EventDispatcher";

export class CollisionExitEvent extends Event {
    static readonly type: string = 'CollisionExit';
}