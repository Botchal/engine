import {Event} from "../../../three/src/core/EventDispatcher";

export class CollisionEnterEvent extends Event {
    static readonly type: string = 'CollisionEnter';
}