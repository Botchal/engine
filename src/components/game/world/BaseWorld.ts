import {Scene} from "../../../three/src/scenes/Scene";

export interface InterfaceBaseWorld {
    constructor(scene: Scene, onLoad: (self: InterfaceBaseWorld) => void)
}

export class BaseWorld implements InterfaceBaseWorld {
    constructor(scene: Scene, onLoad: (self: BaseWorld) => void) {

    }
}