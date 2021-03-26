import {ConfigurableInterface} from "../interfaces/ConfigurableInterface";
import {Config as ConfigParams} from "../interfaces/ConfigurableInterface";
import {ClassLoaderService} from "./ClassLoaderService";

interface Config {
    [difinition: string]: Object;
}

export class ContainerService {
    private static _instance: ContainerService;

    private difinitions: Array<Config>;

    private constructor() {
        //
    }

    public static get Instance(): ContainerService {
        return this._instance || (this._instance = new this());
    }

    setDifinition(type:string, difinition:Object): void {
        this.difinitions[type] = difinition;
    }

    async ensure(config:ConfigParams, type:string): void {
        if (this.difinitions[type]) {
            return ClassLoaderService.Instance.load(type)
        } else {
            throw new Error('Для' + type + ' не определена реализация');
        }
    }
}