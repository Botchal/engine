import {UpdatebleInterface} from "../interfaces/UpdatebleInterface";
import {Mesh} from "../../../three/src/objects/Mesh";
import {Group} from "../../../three/src/objects/Group";
import {MapMetaObject} from "../map/MapMetaObject";
import {BaseMapObject, InterfaceMapObject} from "../base/BaseMapObject";
import {LargeTree} from "../map_objects/LargeTree";
import {Vector3} from "../../../three/src/math/Vector3";
import {Quaternion} from "../../../three/src/math/Quaternion";
import {InstancedMesh} from "../../../three/src/objects/InstancedMesh";

interface MetaObjectsMap<T extends InterfaceMapObject> {
    [key: string]: T;
}

export class MapObjectService {
    private static _instance: MapObjectService;

    private map: Array<any> = [];

    readonly UNKNOWN_REFERENCE:string = '__undefined';

    private constructor() {
        this.map['bigtree'] = new LargeTree();
        this.map[this.UNKNOWN_REFERENCE] = new BaseMapObject();
    }

    public static get Instance(): MapObjectService {
        return this._instance || (this._instance = new this());
    }

    createMeshFromMetaObject(meta_object: MapMetaObject): Mesh | Group {

    }

    createMetaObjectFromMesh(mesh: Mesh | Group, container: Mesh|Group): MapMetaObject | null {
        let reference_name = this.getReferenceNameFromNodeName(mesh.name);

        mesh.updateMatrixWorld();

        if (reference_name && typeof this.map[reference_name] !== 'undefined') {
            return new MapMetaObject(
                reference_name,
                new Vector3().copy(mesh.position),
                new Vector3().copy(container.localToWorld(mesh.position)),
                new Quaternion().setFromEuler(mesh.rotation),
                new Vector3().copy(mesh.scale),
            );
        } else {
            return new MapMetaObject(
                this.UNKNOWN_REFERENCE,
                new Vector3().copy(mesh.position),
                new Vector3().copy(container.localToWorld(mesh.position)),
                new Quaternion().setFromEuler(mesh.rotation),
                new Vector3().copy(mesh.scale),
            );
        }

        return null;
    }

    private getReferenceNameFromNodeName(node_name: string): string {
        let name_data = node_name.split('.');
        if (name_data.length > 1) {
            return name_data[0];
        } else {
            return node_name;
        }
    }
}