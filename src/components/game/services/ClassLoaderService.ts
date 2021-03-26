
export class ClassLoaderService {
    private static _instance: ClassLoaderService;

    private constructor() {
        //
    }

    public static get Instance(): ClassLoaderService {
        return this._instance || (this._instance = new this());
    }

    async load(className:string) {
        return await import(className);
    }
}