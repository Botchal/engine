import {InterfaceMapObject} from "./BaseMapObject";

export interface MapObjectControllerInterface {
    /**
     * Реализация Map Object с которым будет работать контроллер
     */
    owner:InterfaceMapObject

    /**
     * Инициализация контроллера
     * @param owner
     */
    init(owner:InterfaceMapObject):void

    /**
     * Наименования событий
     */
    getMessages():Array<string>
}

export class BaseMapObjectController {

}