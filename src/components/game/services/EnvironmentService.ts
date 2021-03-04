export class EnvironmentService {

    readonly ENV_DEV = 'dev';
    readonly ENV_PROD = 'prod';

    private static _instance: EnvironmentService;

    private env:string;

    private constructor() {
        //
    }

    public static get Instance(): EnvironmentService {
        return this._instance || (this._instance = new this());
    }

    public setEnv(env:string)
    {
        this.env = env;
    }

    public getEnv()
    {
        return this.env;
    }

}