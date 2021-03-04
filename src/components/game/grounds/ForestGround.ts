import {Mesh} from "../../../three/src/objects/Mesh";
import {Texture} from "../../../three/src/textures/Texture";
import {Scene} from "../../../three/src/scenes/Scene";
import {PlaneBufferGeometry} from "../../../three/src/geometries/PlaneBufferGeometry";
import {TextureLoader} from "../../../three/src/loaders/TextureLoader";
import {ImprovedNoise} from "../../../three/examples/jsm/math/ImprovedNoise";
import {MeshPhongMaterial} from "../../../three/src/materials/MeshPhongMaterial";
import {
    DoubleSide,
    NearestFilter,
    NormalMapTypes,
    ObjectSpaceNormalMap,
    RepeatWrapping
} from "../../../three/src/constants";
import {Box3} from "../../../three/src/math/Box3";
import {MeshStandardMaterial} from "../../../three/src/materials/MeshStandardMaterial";
import {Color} from "../../../three/src/math/Color";
import {Vector2} from "../../../three/src/math/Vector2";
import {GLTF, GLTFLoader} from "../../../three/examples/jsm/loaders/GLTFLoader";
import {Object3D} from "../../../three/src/core/Object3D";
import {Group} from "../../../three/src/objects/Group";
import {SplatBlendMaterial} from "../materials/SplatBlendMaterial";
import {ShaderMaterial} from "../../../three/src/materials/ShaderMaterial";
import {Vector3} from "../../../three/src/math/Vector3";
import {WebGLRenderer} from "../../../three/src/renderers/WebGLRenderer";
import {MapObjectService} from "../services/MapObjectService";
import {PlaneGeometry} from "../../../three/src/geometries/PlaneGeometry";
import {MeshBasicMaterial} from "../../../three/src/materials/MeshBasicMaterial";
import {Box3Helper} from "../../../three/src/helpers/Box3Helper";
import {MapMetaObject} from "../map/MapMetaObject";
import {LargeTree} from "../map_objects/LargeTree";
import {InterfaceForestObject, InterfaceMapObject} from "../base/BaseMapObject";
import {MapPositionGeneratorService} from "../services/MapPositionGeneratorService";
import {InstancedMesh} from "../../../three/src/objects/InstancedMesh";
import {Matrix4} from "../../../three/src/math/Matrix4";
import {SphereGeometry} from "../../../three/src/geometries/SphereGeometry";
import {MeshService} from "../services/MeshService";

export class ForestGround {

    private readonly FILE_KEY_SCALE_CONTAINER: string = 'scale_container';
    private readonly FILE_KEY_SECTORS: string = 'sectors';
    private readonly FILE_KEY_INDEXED_OBJECTS: string = 'indexed_objects';
    private readonly FILE_KEY_OBJECTS: string = 'objects';
    private readonly FILE_KEY_START_POINT: string = 'start_point';

    private readonly WIDTH_SECTORS = 8;
    private readonly HEIGHT_SECTORS = 8;

    scene: Scene;
    mesh: Mesh | Group;
    scale_container: Mesh | Group;

    private focusPosition: Vector3;
    private focusPositionVector2: Vector2;
    private currentSector: Mesh | Group = null;
    private besideSectors: Array<Mesh | Group> = [];

    /**
     * Сектора земли карты
     *
     * пронумерованные с 1 по 64 слево направо свеху вниз
     * подобная нумерация позволяет легко высчитывать ближайшие сектора к персонажу не прибегая
     * к distanceTo() к каждому сектору на карте
     */
    public sectors: Array<Mesh | Group> = [];

    /**
     * Объекты на карте по номерам секторов
     *
     * подобная нумерация позволяет легко высчитывать ближайшие объекты к персонажу не прибегая к distanceTo()
     * ко всем объектам на карте. Иными словами при определении какие объекты показывать высчитывается по distanceTo()
     * только объекты из ближайших секторов
     */
    protected indexed_objects: Array<MapMetaObject> = [];

    private readonly global_scale = 12;

    /**
     * Все остальные объекты на карте
     */
    protected objects: Array<MapMetaObject> = [];

    private readonly reference_names = ['bigtree'];
    private reference_map: { [key: string]: InterfaceMapObject } = [];
    private instanced_mesh_map: { [key: string]: Array<InstancedMesh> } = [];

    private _object_scale:Vector3;

    constructor(scene: Scene, onLoad) {
        this.scene = scene;
        this.mesh = new Mesh();
        this.besideSectors = [];

        this.scale_container = new Group();
        this.scale_container.add(this.mesh);

        this.initObjectReference();

        let loader = new GLTFLoader();
        loader.load('/models/worlds/new_test.glb', (gltf: GLTF) => {

            //gltf.scene.scale.set(this.global_scale, this.global_scale, this.global_scale);
            gltf.scene.updateMatrixWorld();
            gltf.scene.updateMatrix();

            gltf.scene.children.forEach((children: Mesh | Group | Object3D, index: number) => {
                if (children.name === this.FILE_KEY_SCALE_CONTAINER) {
                    children.children.forEach((subchildren: Mesh | Group | Object3D, index: number) => {

                        if (subchildren.type === 'Mesh' || subchildren.type === 'Group' || subchildren.type === 'Object3D') {

                            if (subchildren.name === this.FILE_KEY_SECTORS) {
                                this.loadGroundSectors(subchildren);
                            }
                            if (subchildren.name === this.FILE_KEY_INDEXED_OBJECTS) {
                                this.loadIndexedMapObjects(subchildren);
                            }
                            if (subchildren.name === this.FILE_KEY_OBJECTS) {
                                this.loadObjects(subchildren);
                            }
                        }

                    });
                }
            });

            gltf = null;
            onLoad(this);

        });

        this.scale_container.scale.set(this.global_scale, this.global_scale, this.global_scale);
        this.scale_container.updateMatrix();
        this.scale_container.updateMatrixWorld();
        this.scene.add(this.scale_container);

        loader = null;

        this.focusPositionVector2 = new Vector2();
        this._object_scale = new Vector3();
    }

    public getCurrentSector() {
        return this.currentSector;
    }

    public getBesideSectors(limit: number) {
        let array = this.besideSectors;

        /*if (limit > 0) {
            let distanceData = [];
            let vectorPosition = new Vector3();

            array.forEach((sector: Mesh | Group | Object3D, index: number) => {
                distanceData.push({
                    distance: this.focusPosition.distanceTo(sector.getWorldPosition(vectorPosition).setY(0)),
                    sector: sector
                });
            });

            distanceData.sort((a: any, b: any) => {
                return a.distance - b.distance;
            });

            array.length = limit;
        }*/

        return array;
    }

    /**
     * Передать фокусную позицию
     *
     * по усмотрению нужно передавать тогда, когда нужно перестроить мир для его корректного
     * отображения по отношению к тому что мы сейчас наблюдаем
     *
     * например при перемещении персонажа или камеры
     *
     * @param position Vector3
     * @param rebuild boolean
     */
    public setFocusPosition(position: Vector3, rebuild: boolean = true) {
        this.focusPosition = position;
        this.focusPositionVector2.setX(position.x).setY(position.z);
        if (rebuild === true) {

            let time;

            time = performance.now();
            this.rebuildMapSectors();
            time = performance.now() - time;
            document.getElementById('rebuild-sectors-time').innerText = time.toFixed(3);

            time = performance.now();
            this.rebuildMapObjects();
            time = performance.now() - time;
            document.getElementById('rebuild-objects-time').innerText = time.toFixed(3);
        }
    }

    private initObjectReference() {
        new LargeTree().loadObject((forestObject: InterfaceForestObject) => {
            this.reference_map[forestObject.name] = forestObject;
            this.rebuildMapObjects();
        });
    }

    private rebuildMapSectors(): void {

        this.mesh.children = [];

        let distanceData = [];
        let sectors = [];
        if (this.besideSectors.length < 1) {
            sectors = this.sectors;
        } else {
            sectors = this.besideSectors;
        }

        sectors.forEach((sector: Mesh | Group | Object3D, index: number) => {
            if (!sector.userData.worldPositionV2) {
                let positionV3 = sector.getWorldPosition(new Vector3());
                sector.userData.worldPositionV2 = new Vector2(positionV3.x, positionV3.z);
            }
            distanceData.push({
                distance: this.focusPositionVector2.distanceToSquared(sector.userData.worldPositionV2),
                sector: sector
            });
        });
        distanceData.sort((a: any, b: any) => {
            return a.distance - b.distance;
        });

        this.currentSector = distanceData[0].sector;

        let sector_number = distanceData[0].sector.name.replace('sector', '');
        this.besideSectors = this.getBesideSectorsByNumber(sector_number);
        this.besideSectors.forEach((sector: Mesh | Group) => {
            this.mesh.add(sector);
        });
    }

    private rebuildMapObjects(): void {

        let meshServ = MeshService.Instance;
        this.reference_names.forEach((name: string, index: number) => {
            if (this.instanced_mesh_map[name]) {
                meshServ.disposeMeshes(this.instanced_mesh_map[name], false);
                this.instanced_mesh_map[name].forEach((mesh: InstancedMesh) => {
                    this.scale_container.remove(mesh);
                    mesh = null;
                });
                this.instanced_mesh_map[name] = null;
            }
        });

        let count_data = [];

        this.besideSectors.forEach((sector: Mesh | Group | Object3D) => {
            let sector_number = sector.name.replace('sector', '');
            let meta_objects = this.indexed_objects[sector_number];
            if (meta_objects) {
                meta_objects.forEach((object: MapMetaObject) => {

                    if (!object.visible) {
                        return;
                    }

                    //console.log(this.focusPositionVector2);
                    //console.log(object.worldTranslationV2);
                    if (this.focusPositionVector2.distanceToSquared(object.worldTranslationV2) > 150000) {
                        return;
                    }

                    if (this.reference_map[object.reference]) {

                        if (!count_data[object.reference]) {
                            count_data[object.reference] = 0;
                        }
                        count_data[object.reference]++;

                        this.reference_map[object.reference].objectGroup.position.copy(object.translation);
                        if (!this.instanced_mesh_map[object.reference]) {
                            this.instanced_mesh_map[object.reference] = meshServ.createInstancedMeshesFromGroup(
                                this.reference_map[object.reference].objectGroup
                            );
                        }

                        this._object_scale.set(
                            object.scale.x * this.reference_map[object.reference].scale_coefficient,
                            object.scale.y * this.reference_map[object.reference].scale_coefficient,
                            object.scale.z * this.reference_map[object.reference].scale_coefficient,
                        );

                        this.instanced_mesh_map[object.reference].forEach((instance_mesh: InstancedMesh) => {
                            meshServ.applyInstancedMeshTransformations(
                                instance_mesh,
                                count_data[object.reference],
                                object.translation,
                                object.rotation,
                                this._object_scale,
                            );
                        });
                    }
                });
            }
        });

        this.reference_names.forEach((name: string, index: number) => {
            if (this.instanced_mesh_map[name]) {
                this.instanced_mesh_map[name].forEach((mesh: InstancedMesh) => {
                    mesh.count = count_data[name];
                    this.scale_container.add(mesh);
                });
            }
        });

    }

    private getBesideSectorsByNumber(current_number: number): Array<Mesh | Group> {
        let number: number = parseInt(current_number);
        //9 секторов, чтоб получился квадрат 3х3 сектора, а в центре - полученый ближайший сектор
        let beside_numbers = [
            number,
            number - this.WIDTH_SECTORS - 1,
            number - this.WIDTH_SECTORS,
            number - this.WIDTH_SECTORS + 1,
            number - 1,
            number + 1,
            number + this.WIDTH_SECTORS - 1,
            number + this.WIDTH_SECTORS,
            number + this.WIDTH_SECTORS + 1,
        ];
        let result = [];
        beside_numbers.forEach((number: number) => {
            if (this.sectors[number]) {
                result.push(this.sectors[number]);
            }
        });
        return result;
    }

    private loadGroundSectors(sectors: Mesh | Group): void {
        let textureLoader = new TextureLoader();
        let defaultMaterial = new MeshStandardMaterial({
            map: textureLoader.load('/textures/3docean-FfWFIEC9-desert-grass-seamless-texture/Textures/Texture.jpg'),
            //normalMap: textureLoader.load('/textures/3docean-FfWFIEC9-desert-grass-seamless-texture/Textures/Normal.jpg'),
            //lightMap: textureLoader.load('/textures/3docean-IByh9Yvk-seaweed-rocks-seamless-texture/Textures/Specular.jpg'),
            bumpMap: textureLoader.load('/textures/3docean-FfWFIEC9-desert-grass-seamless-texture/Textures/Displace.jpg'),
        });
        defaultMaterial.normalScale.set(0,1.5);
        defaultMaterial.bumpScale = 5;
        defaultMaterial.metalness = 0.1;

        defaultMaterial.side = 2;
        defaultMaterial.flatShading = true;

        defaultMaterial.map.wrapT = defaultMaterial.map.wrapS = RepeatWrapping;
        //defaultMaterial.normalMap.wrapT = defaultMaterial.normalMap.wrapS = RepeatWrapping;
        defaultMaterial.bumpMap.wrapT = defaultMaterial.bumpMap.wrapS = RepeatWrapping;
        //defaultMaterial.displacementMap.wrapT = defaultMaterial.displacementMap.wrapS = RepeatWrapping;

        defaultMaterial.map.repeat.set(4, 4);
        //defaultMaterial.normalMap.repeat.set(4, 4);
        defaultMaterial.bumpMap.repeat.set(8, 8);
        //defaultMaterial.displacementMap.repeat.set(4, 4);


        let i = 0;
        sectors.children.forEach((children: Mesh | Group | Object3D, index: number) => {

            children.updateMatrixWorld();
            children.parent.updateMatrixWorld();
            children.parent.parent.updateMatrixWorld();
            children.parent.parent.parent.updateMatrixWorld();

            let position = new Vector3().copy(children.position);
            children.parent.localToWorld(position);
            children.parent.parent.localToWorld(position);
            //children.parent.parent.parent.localToWorld(position);

            let name = children.name.replace('sector', '');
            this.sectors[name] = children.clone(true);
            this.sectors[name].position.copy(position);
            i++;

            children.material.dispose();
            children.geometry.dispose();
            children = null;

            this.sectors[name].material = defaultMaterial;
        });
        sectors.clear();
        sectors = null;

        this.sectors.forEach((children: Mesh | Group | Object3D) => {
            children.updateMatrix();
            this.mesh.add(children);
        });

        //this.currentSector = this.sectors[28];
    }

    private loadIndexedMapObjects(indexed_objects: Mesh | Group): void {

        indexed_objects.updateMatrix();
        indexed_objects.updateMatrixWorld();
        indexed_objects.getWorldPosition(this.mesh.position);

        let serv = MapObjectService.Instance;
        indexed_objects.children.forEach((children: Mesh | Group, index: number) => {
            if (typeof this.indexed_objects[children.name] === 'undefined') {
                this.indexed_objects[children.name] = [];
            }

            children.children.forEach((subchildren: Mesh | Group) => {

                subchildren.updateMatrixWorld();
                subchildren.parent.updateMatrixWorld();
                subchildren.parent.parent.updateMatrixWorld();
                subchildren.parent.parent.parent.updateMatrixWorld();


                let position = new Vector3().copy(subchildren.position);
                subchildren.parent.localToWorld(position);
                subchildren.parent.parent.localToWorld(position);
                subchildren.parent.parent.parent.localToWorld(position);

                let clone = subchildren.clone(true);
                clone.position.copy(position);

                //this.scale_container.add(clone);

                this.indexed_objects[children.name].push(serv.createMetaObjectFromMesh(clone, this.scale_container));

                subchildren.material.dispose();
                subchildren.geometry.dispose();
                subchildren = null;

                clone.material.dispose();
                clone.geometry.dispose();

            });
        });

        indexed_objects.clear();
        indexed_objects = null;

    }

    private loadObjects(objects: Mesh | Group): void {
        objects.children.forEach((children: Mesh | Group) => {
            this.objects.push(children.clone(true));
        });
    }

    private update(delta: number, renderer: WebGLRenderer) {

    }
}
