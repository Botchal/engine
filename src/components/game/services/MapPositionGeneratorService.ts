import {DefaultGround} from "../grounds/DefaultGround";
import {Vector2} from "../../../three/src/math/Vector2";
import {Vector3} from "../../../three/src/math/Vector3";

/**
 * Сервис для генерации позиций объектов на карте
 */
export class MapPositionGeneratorService {

    /**
     * Тип шума - просто рандомные координаты
     */
    readonly SEED_TYPE_DEFAULT = 1;

    /**
     * Тип шума - Simplex Noise
     * @see https://en.wikipedia.org/wiki/Simplex_noise
     */
    readonly SEED_TYPE_SIMPLEX_NOISE = 2;

    /**
     * Тип шума - Perlin Noise
     * @see https://en.wikipedia.org/wiki/Perlin_noise
     */
    readonly SEED_TYPE_PERLIN_NOISE = 3;

    private static _instance: MapPositionGeneratorService;

    private constructor()
    {
        //...
    }

    public static get Instance():MapPositionGeneratorService
    {
        return this._instance || (this._instance = new this());
    }

    /**
     * Сгенерирует массив координат XY (для последующей расстановки по карте)
     *
     * @param ground
     * @param count Кол-во пар координат
     * @param seed_type Тип шума
     */
    generate(ground: DefaultGround, count: number = 20, seed_type: number = this.SEED_TYPE_DEFAULT): Array<Vector2> {

        if (ground.mesh.geometry.boundingBox === undefined || ground.mesh.geometry.boundingBox === null) {
            ground.mesh.geometry.computeBoundingBox();
        }
        let groundSize: Vector3 = ground.mesh.geometry.boundingBox.getSize(new Vector3(0, 1));
        let groundPosition: Vector3 = ground.mesh.position;
        let vectorX = new Vector2(groundSize.x / 2, groundSize.x + groundSize.x / 2);
        let vectorZ = new Vector2(0 - groundSize.z / 2, groundSize.z - groundSize.z / 2);

        switch(seed_type) {
            case this.SEED_TYPE_DEFAULT: {
                return this.generateAsDefaultNoise(vectorX, vectorZ, count);
            }
            default: {
                return this.generateAsDefaultNoise(vectorX, vectorZ, count);
            }
        }
    }

    protected generateAsDefaultNoise(vectorX: Vector2, vectorZ: Vector2, seed_count: number): Array<Vector2> {
        let coords: Array<Vector2> = [];
        for (let i = 0; i <= seed_count; i++) {
            let x = Math.random() * (vectorX.x - vectorX.y) + vectorX.x;
            let y = Math.random() * (vectorZ.x - vectorZ.y) + vectorZ.y;
            let vec = new Vector2(x, y);
            coords.push(vec);
        }
        return coords;
    }

    protected generateAsSimplexNoise(min: Vector2, max: Vector2, seed_count: number) {

    }

    protected generateAsPerlinNoise(min: Vector2, max: Vector2, seed_count: number) {

    }
}