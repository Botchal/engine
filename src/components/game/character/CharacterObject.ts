import {SkinnedMesh} from "../../../three/src/objects/SkinnedMesh";
import {MMDAnimationHelper} from "../../../three/examples/jsm/animation/MMDAnimationHelper";
import {MMDLoader} from "../../../three/examples/jsm/loaders/MMDLoader";
import {Clock} from "../../../three/src/core/Clock";
import {Scene} from "../../../three/src/scenes/Scene";
import {AnimationConfig} from "./AnimationConfig";

interface callback {
    (object: CharacterObject): void
}

export interface CharacterObjectInterface {

}

export class CharacterObject implements CharacterObjectInterface {
    bodyMesh: SkinnedMesh;
    animationHelper: MMDAnimationHelper;
    modelUrl: string;
    callback: callback;
    loader: MMDLoader;
    clock: Clock;

    scene: Scene;

    public static get className():string {
        return './components/game/character/CharacterObject';
    }

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
        this.loader.load(this.modelUrl, this.onLoadMesh.bind(this))
    }

    onLoadMesh(mesh: SkinnedMesh) {
        console.log(this);
        this.bodyMesh = mesh
        this.bodyMesh.castShadow = true
        this.bodyMesh.position.y = 25

        this.scene.add(this.bodyMesh)

        this.scene.add(this.bodyMesh)

        this.callback(this)
    }

    static animationWalk() {
        console.log('not loaded')
    }

    static animationRun() {
        console.log('not loaded')
    }

    update() {
        this.animationHelper.update(this.clock.getDelta())
    }

}
