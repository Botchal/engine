import {Event} from "../../../three/src/core/EventDispatcher";

export class CollisionStayEvent extends Event {
    static readonly type: string = 'CollisionStay';
}