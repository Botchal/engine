import {Event} from "../../../three/src/core/EventDispatcher";

export class CollisionEnterEvent implements Event {
    type: string = 'CollisionEnter';
}