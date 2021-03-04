import {Mesh} from "../../../three/src/objects/Mesh";
import {Texture} from "../../../three/src/textures/Texture";
import {Scene} from "../../../three/src/scenes/Scene";
import {PlaneBufferGeometry} from "../../../three/src/geometries/PlaneBufferGeometry";
import {TextureLoader} from "../../../three/src/loaders/TextureLoader";
import {ImprovedNoise} from "../../../three/examples/jsm/math/ImprovedNoise";
import {MeshPhongMaterial} from "../../../three/src/materials/MeshPhongMaterial";
import {DoubleSide, NormalMapTypes, ObjectSpaceNormalMap} from "../../../three/src/constants";
import {Box3} from "../../../three/src/math/Box3";
import {MeshStandardMaterial} from "../../../three/src/materials/MeshStandardMaterial";
import {Color} from "../../../three/src/math/Color";
import {Vector2} from "../../../three/src/math/Vector2";

export class DefaultGround {

    scene: any
    mesh: Mesh
    geometry: any
    worldWidth = 64;
    worldDepth = 64;


    constructor(scene: Scene) {
        this.scene = scene

        const data = this.generateHeight(this.worldWidth, this.worldDepth)

        this.geometry = new PlaneBufferGeometry(2500, 2500, this.worldWidth - 1, this.worldDepth - 1)
        this.geometry.rotateX(-Math.PI / 2)

        //this.geometry.normalizeNormals()

        interface PositionArray {
            [index: number]: number;

            length: number

        }

        const vertices: PositionArray = this.geometry.attributes.position.array

        for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {

            vertices[j + 1] = data[i] * 5

        }

        console.log(this.geometry);

        this.geometry.computeFaceNormals()
        this.geometry.computeVertexNormals()


        let repeat = new Vector2(32, 32);
        let path = '/textures/3docean-FfWFIEC9-desert-grass-seamless-texture/Textures/';
        let map = new TextureLoader().load(path + 'Texture.jpg')
        map.wrapS = 1000
        map.wrapT = 1000
        map.repeat.copy(repeat)
        map.encoding = 3001

        let normalMap = new TextureLoader().load(path + 'Normal.jpg')
        normalMap.wrapS = 1000
        normalMap.wrapT = 1000
        normalMap.repeat.copy(repeat)
        normalMap.encoding = 3001


        let displacementMap = new TextureLoader().load(path + 'Displace.jpg')
        displacementMap.wrapS = 1000
        displacementMap.wrapT = 1000
        displacementMap.repeat.copy(repeat)
        displacementMap.encoding = 3001


        this.mesh = new Mesh(this.geometry, new MeshStandardMaterial({
            map: map,
            normalMap: normalMap,
            normalScale: new Vector2(1,3),
            displacementMap: displacementMap,
            displacementScale: 1,

            //lightMap: lightMap,

        }));
        this.mesh.position.y = 0
        this.mesh.material.side = 2
        // note that because the ground does not cast a shadow, .castShadow is left false
        this.mesh.receiveShadow = true

        this.mesh.geometry.computeBoundingBox();

        this.mesh.updateMatrixWorld();
        this.mesh.matrixWorldNeedsUpdate = false;

        this.scene.add(this.mesh)
    }

    generateHeight(width, height) {
        const size = width * height
        const data = new Uint8Array(size)
        const perlin = new ImprovedNoise()
        const z = Math.random() * 2

        let quality = 6

        for (let j = 0; j < 3; j++) {

            for (let i = 0; i < size; i++) {

                const x = i % width
                const y = ~~(i / width)
                data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 0.2)

            }

            quality *= 5

        }

        return data
    }

}
