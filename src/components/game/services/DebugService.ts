
interface DebugDataInterface {
    [key: string]: any;
}

export class DebugService {
    private static _instance: DebugService;

    private data:DebugDataInterface;

    private constructor() {
        //
    }

    public static get Instance(): DebugService {
        return this._instance || (this._instance = new this());
    }

    public setIndicator(code: string, value: any) {
        this.data[code] = value;
    }

    public getIndicator(code: string) {
        return this.data[code];
    }
}