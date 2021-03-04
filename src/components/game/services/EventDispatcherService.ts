import {EventDispatcher} from "../../../three/src/core/EventDispatcher";

export class EventDispatcherService {
    private static _instance: EventDispatcherService;

    public dispatcher:EventDispatcher

    private constructor() {
        this.dispatcher = new EventDispatcher();
    }

    public static get Instance(): EventDispatcherService {
        return this._instance || (this._instance = new this());
    }
}