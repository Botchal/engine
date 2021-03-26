import {Config, ConfigurableInterface} from "../interfaces/ConfigurableInterface";


export class BaseObject implements ConfigurableInterface {
    constructor(config: Config) {
        config.forEach((value: any, key: string) => {
            if (this.hasOwnProperty(key)) {
                this[key] = value;
            }
        });
        this.init();
    }

    public init() {

    }
}