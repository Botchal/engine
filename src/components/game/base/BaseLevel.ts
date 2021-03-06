import {UpdatebleInterface} from "../interfaces/UpdatebleInterface";
import {WebGLRenderer} from "../../../three/src/renderers/WebGLRenderer";
import {PerspectiveCamera} from "../../../three/src/cameras/PerspectiveCamera";
import {Scene} from "../../../three/src/scenes/Scene";
import {AmbientLight} from "../../../three/src/lights/AmbientLight";
import {DirectionalLight} from "../../../three/src/lights/DirectionalLight";
import {Clock} from "../../../three/src/core/Clock";
import {Color} from "../../../three/src/math/Color";
import Stats from "../../../three/examples/jsm/libs/stats.module";
import {RenderPass} from "../../../three/examples/jsm/postprocessing/RenderPass";
import {EffectComposer} from "../../../three/examples/jsm/postprocessing/EffectComposer";
import {LinearEncoding} from "../../../three/src/constants";
import {BaseObject} from "./BaseObject";
import {DebugService} from "../services/DebugService";
import {LevelInterface} from "../interfaces/LevelInterface";

export type DOMElement = globalThis.Element

export interface BaseLevelInterface {
    container: DOMElement;
    renderer: WebGLRenderer;
    composer: EffectComposer;
    camera: PerspectiveCamera;
    scene: Scene;
    ambientLight: AmbientLight;
    directionalLight: DirectionalLight;
    clock: Clock;
    stats: Stats;
    updatebleObjects: Array<UpdatebleInterface>;

    mapWeight: number;
    mapHeight: number;
}

export class BaseLevel extends BaseObject implements BaseLevelInterface, LevelInterface {
    name:string = 'base';
    container: any;
    renderer: WebGLRenderer;
    composer: EffectComposer;
    camera: PerspectiveCamera;
    scene: Scene;
    ambientLight: AmbientLight;
    directionalLight: DirectionalLight;
    clock: Clock;
    stats: Stats;
    updatebleObjects: any;

    mapWeight = 512;
    mapHeight = 512;

    private readyCallback;

    enter(): void {
        //RENDERER
        this.renderer = new WebGLRenderer({antialias: true})
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setClearColor(new Color(0xefd1b5))
        this.container.appendChild(this.renderer.domElement)
        this.renderer.shadowMap.enabled = true
        this.renderer.outputEncoding = LinearEncoding;


        this.renderer.shadowMap.type = 2;

        //CLOCK
        this.clock = new Clock();

        //STATS
        this.stats = new Stats();
        this.container.appendChild(this.stats.dom);

        //CAMERA
        this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000)
        this.camera.position.set(28, 64, 71)
        //this.camera.far = 200


        //SCENE
        this.scene = new Scene();
        this.scene.background = new (Color)(0xE0FFFF);
        //this.scene.fog = new Fog(0xE0FFFF, 100, 500);

        // LIGHTS
        // LIGHTS

        this.scene.add(new AmbientLight(0xfff917, 0.1));
        this.scene.add(new AmbientLight(0xffffff, 0.2));

        this.directionalLight = new DirectionalLight(0xffffff, 1);
        this.directionalLight.position.set(200, 1000, 500);

        /*this.directionalLight.castShadow = true;


        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 10000;
        this.directionalLight.shadow.camera.left = -500;
        this.directionalLight.shadow.camera.bottom = -500;
        this.directionalLight.shadow.camera.right = 1500;
        this.directionalLight.shadow.camera.top = 1500;
        this.directionalLight.shadow.mapSize.width = 4096;
        this.directionalLight.shadow.mapSize.height = 4096;*/

        this.scene.add(this.directionalLight);

        this.updatebleObjects = [];


        // COMPOSER

        this.renderer.autoClear = false;

        const renderModel = new RenderPass(this.scene, this.camera);

        /*const effectBleach = new ShaderPass(BleachBypassShader);
        const effectColor = new ShaderPass(ColorCorrectionShader);
        let effectFXAA = new ShaderPass(FXAAShader);
        const gammaCorrection = new ShaderPass(GammaCorrectionShader);

        effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);

        effectBleach.uniforms['opacity'].value = 0.1;

        effectColor.uniforms['powRGB'].value.set(1.4, 1.45, 1.45);
        effectColor.uniforms['mulRGB'].value.set(1.1, 1.1, 1.1);*/

        this.composer = new EffectComposer(this.renderer);

        this.composer.addPass(renderModel);
        //this.composer.addPass(effectFXAA);
        //this.composer.addPass(effectBleach);
        //this.composer.addPass(effectColor);
        //this.composer.addPass(gammaCorrection);

        this.initScene();
    }

    exit(): void {

    }

    initScene() {

        this.readyCallback(this);
        this.animate();

    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    animate() {
        let scope = this;
        requestAnimationFrame(function () {
            scope.animate()
        });
        scope.render()
        //this.physWorld.step();
    }

    render() {
        this.composer.render();
        this.updatebleObjects.forEach(this.updateUpdatebleObject.bind(this));
        this.stats.update();
        this.customStats();
    }

    customStats() {
        let serv = DebugService.Instance;
        serv.setIndicator('calls-value', this.renderer.info.render.calls);
        serv.setIndicator('points-value', this.renderer.info.render.points);
        serv.setIndicator('triangles-value', this.renderer.info.render.triangles);
        serv.setIndicator('geometries-value', this.renderer.info.memory.geometries);
        serv.setIndicator('textures-value', this.renderer.info.memory.textures);
        serv.setIndicator('programs-value', this.renderer.info.programs.length);
    }

    updateUpdatebleObject(object: UpdatebleInterface) {
        object.update(this.clock.getDelta(), this.renderer);
    }

}