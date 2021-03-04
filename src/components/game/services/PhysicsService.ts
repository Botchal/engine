import {UpdatebleInterface} from "../interfaces/UpdatebleInterface";
import {RigidBody, World} from "../../../oimo/build/oimo.module";
import {Mesh} from "../../../three/src/objects/Mesh";
import {MeshBasicMaterial} from "../../../three/src/materials/MeshBasicMaterial";
import {Color} from "../../../three/src/math/Color";
import {SphereGeometry} from "../../../three/src/geometries/SphereGeometry";
import {Vector3} from "../../../three/src/math/Vector3";
import {EnvironmentService} from "./EnvironmentService";

export class PhysicsService {

    /**
     * Тип RigidBody - сфера
     */
    readonly BODY_TYPE_SPHERE = 'sphere';
    /**
     * Тип RigidBody - куб
     */
    readonly BODY_TYPE_CUBE = 'cube';
    /**
     * Тип RigidBody - план
     */
    readonly BODY_TYPE_PLANE = 'plane';

    public physWorld: World;
    public physBody: RigidBody;
    public physGroundSpheres:Array<RigidBody> = [];

    public physGroundSpheresHelpers:Array<Mesh> = [];
    public physBodyHelper: Mesh;

    private static _instance: PhysicsService;

    private constructor() {
        this.initPhysics();
    }

    public static get Instance(): PhysicsService {
        return this._instance || (this._instance = new this());
    }

    private initPhysics(){
        this.physWorld = new World({
            timestep: 1/60,
            iterations: 1,
            broadphase: 3, // 1: brute force, 2: sweep & prune, 3: volume tree
            worldscale: 1,
            random: false,
            info:true, // display statistique
            gravity: [0,-250,0]
        });

        this.physBody = this.physWorld.add({
            type: 'sphere', // type of shape : sphere, box, cylinder
            size: [50, 50, 50], // size of shape
            pos: [0, 0, 0], // start position in degree
            rot: [0, 0, 90], // start rotation in degree
            move: true, // dynamic or statique
            density: 0.0000001,
            friction: 1000000000,
            restitution: 0,
            belongsTo: 1, // The bits of the collision groups to which the shape belongs.
            collidesWith: 0xffffffff, // The bits of the collision groups with which the shape collides.
        });

        window.physBody = this.physBody;
    }

    setPhysGround(mesh:Mesh){
        var vertices = mesh.geometry.attributes.position.array;
        mesh.updateMatrixWorld();
        console.log(mesh.geometry);

        let mat = new MeshBasicMaterial({color:new Color(0x000000), wireframe:true});

        if (EnvironmentService.Instance.getEnv() === 'dev') {
            let geometry = new SphereGeometry(15, 16, 16);
            let material = new MeshBasicMaterial({wireframe: true, color: new Color(0x000000)});
        }

        let wPos = new Vector3();
        for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {

            let x = vertices[ j ];
            let y = vertices[ j+1 ];
            let z = vertices[ j+2 ];

            wPos.set(x,y,z);
            mesh.localToWorld(wPos);
            if (wPos.x) {
                let sphere = this.physWorld.add({type:'sphere', size:[25,25,25], pos:[wPos.x,wPos.y,wPos.z] })
                this.physGroundSpheres.push(sphere);

                if (EnvironmentService.Instance.getEnv() === 'dev') {
                    let hmesh = new Mesh( geometry, material );
                     hmesh.position.copy(wPos);

                     this.scene.add(hmesh);
                }
            }

        }
    }

}