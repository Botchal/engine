import {SkinnedMesh} from "../../../three/src/objects/SkinnedMesh";
import {MMDAnimationHelper} from "../../../three/examples/jsm/animation/MMDAnimationHelper";
import {MMDLoader} from "../../../three/examples/jsm/loaders/MMDLoader";
import {Clock} from "../../../three/src/core/Clock";
import {Scene} from "../../../three/src/scenes/Scene";
import {AnimationConfig} from "./AnimationConfig";
import {Vector3} from "../../../three/src/math/Vector3";
import {SphereGeometry} from "../../../three/src/geometries/SphereGeometry";
import {MeshBasicMaterial} from "../../../three/src/materials/MeshBasicMaterial";
import {Color} from "../../../three/src/math/Color";
import {Mesh} from "../../../three/src/objects/Mesh";
import {BoxGeometry} from "../../../three/src/geometries/BoxGeometry";

interface callback {
    (object: CharacterObject): void
}


export class CharacterObject {
    bodyMesh: SkinnedMesh;
    animationHelper: MMDAnimationHelper;
    modelUrl: string;
    callback: callback;
    loader: MMDLoader;
    clock: Clock;

    scene: Scene;

    constructor(scene: Scene, clock: Clock, modelUrl: string, animationConfig: AnimationConfig, callback: callback) {
        this.animationHelper = new MMDAnimationHelper({
            afterglow: 1,
            sync: false,
            resetPhysicsOnLoop: false,
        });
        this.bodyMesh = new SkinnedMesh();
        this.scene = scene;
        this.clock = clock;
        this.modelUrl = modelUrl;
        this.callback = callback;
        this.loader = new MMDLoader();
        this.initCharacter.bind(this);
        this.initCharacter();
    }

    initCharacter() {
        this.loader.load(this.modelUrl, this.onLoadMesh.bind(this), this.onLoadProgress, function (event: ErrorEvent) {
            console.log(event)
        })
    }

    onLoadMesh(mesh: SkinnedMesh) {
        console.log(this);
        this.bodyMesh = mesh
        this.bodyMesh.castShadow = true
        this.bodyMesh.position.y = 25

        /*let mesh1 = new Mesh(
            new SphereGeometry( 20, 16, 16 ),
            new MeshBasicMaterial({wireframe: true, color: new Color(0x000000)})
        );
        this.bodyMesh = mesh1;*/

        this.scene.add(this.bodyMesh)

        /*this.loader.loadAnimation(
            '/models/girl_mmd/vmds/1.vmd',
            this.bodyMesh,
            this.onLoadAnimation.bind(this),
            this.onLoadProgress.bind(this),
            undefined
        )*/

        this.scene.add(this.bodyMesh)


        //this.bodyMesh.geometry.computeFaceNormals()

        //this.bodyMesh.geometry.computeVertexNormals()

        this.callback(this)
    }

    onLoadAnimation(clip: any) {
        //this.animationHelper.remove(this.bodyMesh)
        this.animationHelper.add(this.bodyMesh, {
            animation: clip,
            physics: true,
            warmup: 10,
            gravity: new Vector3(0, -4.8 * 10, 0),
            maxStepNum: 1,
        })
    }

    onLoadProgress(xhr: any) {
        if (xhr.lengthComputable) {
            const percentComplete = xhr.loaded / xhr.total * 100
            console.log(Math.round(percentComplete) + '% downloaded')
        }
    }

    animationWalk() {
        console.log('not loaded')
    }

    animationRun() {
        console.log('not loaded')
    }

    update() {
        this.animationHelper.update(this.clock.getDelta())
    }

}
