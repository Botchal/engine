import {Mesh} from "../../../three/src/objects/Mesh";
import {WebGLRenderer} from "../../../three/src/renderers/WebGLRenderer";
import {PerspectiveCamera} from "../../../three/src/cameras/PerspectiveCamera";
import {DirectionalLight} from "../../../three/src/lights/DirectionalLight";
import {OrbitControlsFollowingObject} from "../jsm/OrbitControlsFollowingObject.js";
import {Gyroscope} from "../../../three/examples/jsm/misc/Gyroscope";

export class CharacterCamera {
  character:Mesh;

  renderer: WebGLRenderer;
  camera: PerspectiveCamera;
  light: DirectionalLight;
  controls: OrbitControlsFollowingObject;
  gyro: Gyroscope;

  constructor(characterMesh:Mesh, camera: PerspectiveCamera, light:DirectionalLight, renderer:WebGLRenderer){
    this.character = characterMesh
    this.camera = camera
    this.light = light
    this.renderer = renderer

    this.controls = new OrbitControlsFollowingObject(this.camera, this.renderer.domElement, this.character)
    this.controls.minDistance = 100
    this.controls.maxDistance = 2000
    this.controls.autoRotate = false
    this.controls.enablePan = false
    this.controls.maxPolarAngle = Math.PI / 3.5;
    this.controls.minPolarAngle = Math.PI / 8;
    //this.controls.maxAzimuthAngle = Math.PI;
    //this.controls.minAzimuthAngle = Math.PI / 2;

    this.gyro = new Gyroscope();
    //this.gyro.add(this.light, this.light.target)
    this.gyro.add(this.camera)

    this.camera.lookAt(this.character.position);
    this.character.add(this.gyro)

    this.controls.update();
  }

}
