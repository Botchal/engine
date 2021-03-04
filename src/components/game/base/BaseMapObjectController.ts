import {InterfaceMapObject} from "./BaseMapObject";
import {EventDispatcherService} from "../services/EventDispatcherService";
import {CollisionEnterEvent} from "../events/CollisionEnterEvent";
import {CollisionStayEvent} from "../events/CollisionStayEvent";
import {CollisionExitEvent} from "../events/CollisionExitEvent";
import {CameraObstructEvent} from "../events/CameraObstructEvent";

export interface MapObjectControllerInterface {
    /**
     * Реализация Map Object с которым будет работать контроллер
     */
    owner:InterfaceMapObject

    /**
     * Инициализация обработчиков событий
     *
     * @param owner
     */
    create(owner:InterfaceMapObject):void

    /**
     * Инициализация контроллера
     *
     * @param owner
     */
    destroy(owner:InterfaceMapObject):void

    /**
     * Наименования событий
     */
    Messages():Array<string>
}

export class BaseMapObjectController {

    private owner:InterfaceMapObject

    create(owner:InterfaceMapObject){
        this.owner = owner
        this.Messages.forEach((message:string) => {
            EventDispatcherService.Instance.dispatcher.addEventListener(message, this[message].bind(this));
        });
    }
    destroy(){
        this.Messages.forEach((message:string) => {
            EventDispatcherService.Instance.dispatcher.removeEventListener(message, this[message].bind(this));
        });
    }
    public static get Messages():Array<string> {
        return [
            'OnCollisionEnter',
            'OnCollisionExit',
            'OnCollisionStay',
            'OnCameraObstruct',
        ];
    }

    OnCollisionEnter(event:CollisionEnterEvent):void {

    }

    OnCollisionExit(event:CollisionExitEvent):void {

    }

    OnCollisionStay(event:CollisionStayEvent):void {

    }

    OnCameraObstruct(event:CameraObstructEvent):void {

    }
}