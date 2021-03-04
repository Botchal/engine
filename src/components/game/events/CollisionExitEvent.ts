import {Event} from "../../../three/src/core/EventDispatcher";

export class CollisionExitEvent implements Event{
    type:string = 'CollisionExit';
}