import {Vector3} from "../../../three/src/math/Vector3";
import {Quaternion} from "../../../three/src/math/Quaternion";
import {Mesh} from "../../../three/src/objects/Mesh";
import {Group} from "../../../three/src/objects/Group";
import {InstancedMesh} from "../../../three/src/objects/InstancedMesh";
import {Vector2} from "../../../three/src/math/Vector2";

export class MapMetaObject {

    public reference: string;
    public translation: Vector3;
    public translationV2: Vector2;
    public worldTranslation: Vector3;
    public worldTranslationV2: Vector2;
    public rotation: Quaternion;
    public scale: Vector3;
    public visible:boolean = true;

    constructor(reference:string, translation:Vector3, worldTranslation:Vector3, rotation:Quaternion, scale:Vector3){
        this.reference = reference;
        this.translation = translation;
        this.translationV2 = new Vector2().setX(this.translation.x).setY(this.translation.z);
        this.worldTranslation = worldTranslation;
        this.worldTranslationV2 = new Vector2().setX(this.worldTranslation.x).setY(this.worldTranslation.z);
        this.rotation = rotation;
        this.scale = scale;
    }

}