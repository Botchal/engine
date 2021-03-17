import {Event} from "../../../three/src/core/EventDispatcher";

export class CameraObstructEvent extends Event {
    static readonly type: string = 'CameraObstruct';
}