import {Raycaster} from "../../../three/src/core/Raycaster";
import {UpdatebleInterface} from "../interfaces/UpdatebleInterface";

export class UpdatebleService {
    private static _instance: UpdatebleService;

    stack:Array<UpdatebleInterface> = [];

    private constructor() {
        ///...
    }

    public static get Instance(): UpdatebleService {
        return this._instance || (this._instance = new this());
    }

    add(obj:UpdatebleInterface){
        this.stack.push(obj);
    }

    getAll(){
        return this.stack;
    }
}