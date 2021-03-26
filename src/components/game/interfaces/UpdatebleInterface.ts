import {Renderer} from "../../../three/src/renderers/WebGLRenderer";

export interface UpdatebleInterface {
    update(delta:number, renderer:Renderer):void
}