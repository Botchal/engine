import {InstancedMesh} from "../../../three/src/objects/InstancedMesh";
import {Mesh} from "../../../three/src/objects/Mesh";
import {Group} from "../../../three/src/objects/Group";
import {Matrix4} from "../../../three/src/math/Matrix4";
import {Vector3} from "../../../three/src/math/Vector3";
import {Quaternion} from "../../../three/src/math/Quaternion";
import {Material} from "../../../three/src/materials/Material";
import {Object3D} from "../../../three/src/core/Object3D";

export class MeshService {
    private static _instance: MeshService;

    private _matrix: Matrix4;

    private constructor() {
        this._matrix = new Matrix4();
    }

    public static get Instance(): MeshService {
        return this._instance || (this._instance = new this());
    }

    /**
     * Создаст из {mesh:Mesh} InstancedMesh
     * @param mesh
     * @param instance_count
     */
    public createInstancedMeshFromMesh(mesh: Mesh, instance_count: number = 100): InstancedMesh {
        return new InstancedMesh(
            mesh.geometry,
            mesh.material,
            instance_count
        );
    }

    /**
     * Создаст из {Group} массив {InstancedMesh}
     *
     * @param group
     * @param instance_count
     */
    public createInstancedMeshesFromGroup(group: Group, instance_count: number = 100): Array<InstancedMesh> {
        let meshes = [];
        let i = 0;
        group.children.forEach((children: Mesh | Group) => {
            if (children.type === 'Mesh') {
                let instance_mesh = new InstancedMesh(
                    children.geometry,
                    children.material,
                    instance_count
                );
                instance_mesh.name = 'instance_mesh_from_' + group.name + '_index_' + i;
                meshes.push(instance_mesh);
            }
            i++;
        });

        return meshes;
    }

    /**
     * Добавит преобразования к {mesh:InstancedMesh}, состоящее из:
     *
     * позиции {position:Vector3},
     * вращения {rotation:Quaternion},
     * масштаба {scale:Vector3}.
     *
     * @param mesh
     * @param index
     * @param position
     * @param rotation
     * @param scale
     */
    public applyInstancedMeshTransformations(
        mesh: InstancedMesh,
        index: number,
        position: Vector3,
        rotation: Quaternion,
        scale: Vector3
    ): void {
        this._matrix.compose(position, rotation, scale);
        mesh.setMatrixAt(index, this._matrix);
    }

    /**
     * Избавиться от {mesh:Mesh}
     *
     * в т.ч. потомков
     *
     * @param mesh
     * @param dispose_material
     */
    public disposeMesh(mesh: Mesh | InstancedMesh, dispose_material:boolean = true): void {
        if (dispose_material && mesh.material) {
            if (Array.isArray(mesh.material)) {
                mesh.material.forEach((material: Material) => {
                    material.dispose();
                });
            } else {
                mesh.material.dispose();
            }
        }
        if (mesh.geometry) {
            mesh.geometry.dispose();
        }
        mesh.children.forEach((children: Mesh) => {
            if (dispose_material) {
                if (Array.isArray(children.material)) {
                    children.material.forEach((material: Material) => {
                        material.dispose();
                    });
                } else {
                    children.material.dispose();
                }
            }
            if (children.geometry) {
                children.geometry.dispose();
            }
        });
        mesh.clear();
    }

    /**
     * Избавиться от {meshes:Array<Mesh|InstancedMesh>}
     *
     * в т.ч. потомков
     *
     * @param meshes
     * @param dispose_materials
     */
    public disposeMeshes(meshes: Array<Mesh | InstancedMesh>, dispose_materials:boolean = true): void {
        meshes.forEach((children: Mesh) => {
            this.disposeMesh(children, dispose_materials);
        });
    }

    public findLastParent(object: Object3D | Mesh | Group): Group | Mesh {
        let result;
        object.children.forEach((children: Object3D | Mesh | Group) => {
            if (children.type === 'Mesh') {
                result = object;
            } else {
                result = this.findLastParent(children);
            }
        });

        return result;
    }

    /**
     * Заменить инстанс на меш
     *
     * @param instanceMesh
     * @param index
     * @param mesh
     * @param fakeReplacement Фейковая замена (выставит y в -100000)
     */
    public replaceInstancedMeshIndexWithMesh(
        instanceMesh:InstancedMesh,
        index:number,
        mesh:Mesh,
        fakeReplacement:boolean = true
    ):void {
        if (fakeReplacement) {
            instanceMesh.getMatrixAt(index, this._matrix);
            mesh.position.setFromMatrixPosition(this._matrix)
            mesh.scale.setFromMatrixScale(this._matrix)
            mesh.rotation.setFromRotationMatrix(this._matrix)
        } else {
            throw new TypeError('Это ещё не реализовано')
        }
    }

}