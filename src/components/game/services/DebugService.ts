
interface DebugDataInterface {
    [key: string]: any;
}

export class DebugService {
    private static _instance: DebugService;

    private data:DebugDataInterface;
    private _info:Array<any>;
    private _warning:Array<any>;
    private _error:Array<any>;

    private constructor() {
        setInterval(() => {
            console.log("Log data:");
            this._info.forEach((data:any, index:number) => {
                console.info(data);
            });
            this._info.length = 0;

            this._warning.forEach((data:any, index:number) => {
                console.warn(data);
            });
            this._warning.length = 0;

            this._error.forEach((data:any, index:number) => {
                console.error(data);
            });
            this._error.length = 0;

        }, 1500);
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

    public info (data:any) {
        this._info.push(data);
    }

    public warning (data:any) {
        this._warning.push(data);
    }

    public error (data:any) {
        this._error.push(data);
    }
}