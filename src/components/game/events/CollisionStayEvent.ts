import {Event} from "../../../three/src/core/EventDispatcher";

export class CollisionStayEvent implements Event{
    type:string = 'CollisionStay';
}