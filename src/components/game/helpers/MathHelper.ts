
export class MathHelper {

    static exponentialEaseOut(k: number, x:number = 2, y:number = -30, bias:number = 1) {
        return k === 1 ? 1 : -Math.pow(x, y * k) + bias;
    }

    static exponentialEaseIn(k: number, x:number = 2, y:number = -30, bias:number = 1) {
        return k === 1 ? 1 : Math.pow(x, y * k) - bias;
    }
}