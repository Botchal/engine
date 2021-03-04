declare namespace _Math {
    const sqrt: (x: number) => number;
    const abs: (x: number) => number;
    const floor: (x: number) => number;
    const cos: (x: number) => number;
    const sin: (x: number) => number;
    const acos: (x: number) => number;
    const asin: (x: number) => number;
    const atan2: (y: number, x: number) => number;
    const round: (x: number) => number;
    const pow: (x: number, y: number) => number;
    const max: (...values: number[]) => number;
    const min: (...values: number[]) => number;
    const random: () => number;
    const degtorad: number;
    const radtodeg: number;
    const PI: number;
    const TwoPI: number;
    const PI90: number;
    const PI270: number;
    const INF: number;
    const EPZ: number;
    const EPZ2: number;
    function lerp(x: any, y: any, t: any): number;
    function randInt(low: any, high: any): any;
    function rand(low: any, high: any): any;
    function generateUUID(): string;
    function int(x: any): number;
    function fix(x: any, n: any): any;
    function clamp(value: any, min: any, max: any): number;
    function distance(p1: any, p2: any): number;
    function acosClamp(cos: any): number;
    function distanceVector(v1: any, v2: any): number;
    function dotVectors(a: any, b: any): number;
}
export class Vec3 {
    constructor(x: any, y: any, z: any);
    x: any;
    y: any;
    z: any;
}
export class Quat {
    constructor(x: any, y: any, z: any, w: any);
    x: any;
    y: any;
    z: any;
    w: any;
}
export class Mat33 {
    constructor(e00: any, e01: any, e02: any, e10: any, e11: any, e12: any, e20: any, e21: any, e22: any, ...args: any[]);
    elements: number[];
}
/**
 * A shape is used to detect collisions of rigid bodies.
 *
 * @author saharan
 * @author lo-th
 */
export class Shape {
    /**
     * A shape is used to detect collisions of rigid bodies.
     *
     * @author saharan
     * @author lo-th
     */
    constructor(config: any);
    type: number;
    id: number;
    prev: any;
    next: any;
    proxy: any;
    parent: any;
    contactLink: any;
    numContacts: number;
    position: Vec3;
    rotation: Mat33;
    relativePosition: any;
    relativeRotation: any;
    aabb: AABB;
    density: any;
    friction: any;
    restitution: any;
    belongsTo: any;
    collidesWith: any;
}
/**
 * Box shape.
 * @author saharan
 * @author lo-th
 */
export class Box {
    /**
     * Box shape.
     * @author saharan
     * @author lo-th
     */
    constructor(config: any, Width: any, Height: any, Depth: any);
    type: number;
    width: any;
    height: any;
    depth: any;
    halfWidth: number;
    halfHeight: number;
    halfDepth: number;
    dimentions: Float32Array;
    elements: Float32Array;
}
/**
 * Sphere shape
 * @author saharan
 * @author lo-th
 */
export class Sphere {
    /**
     * Sphere shape
     * @author saharan
     * @author lo-th
     */
    constructor(config: any, radius: any);
    type: number;
    radius: any;
}
/**
 * Cylinder shape
 * @author saharan
 * @author lo-th
 */
export class Cylinder {
    /**
     * Cylinder shape
     * @author saharan
     * @author lo-th
     */
    constructor(config: any, radius: any, height: any);
    type: number;
    radius: any;
    height: any;
    halfHeight: number;
    normalDirection: Vec3;
    halfDirection: Vec3;
}
/**
 * Plane shape.
 * @author lo-th
 */
export class Plane {
    /**
     * Plane shape.
     * @author lo-th
     */
    constructor(config: any, normal: any);
    type: number;
    normal: Vec3;
}
/**
 * A Particule shape
 * @author lo-th
 */
export class Particle {
    /**
     * A Particule shape
     * @author lo-th
     */
    constructor(config: any, normal: any);
    type: number;
}
/**
 * A shape configuration holds common configuration data for constructing a shape.
 * These configurations can be reused safely.
 *
 * @author saharan
 * @author lo-th
 */
export class ShapeConfig {
    relativePosition: Vec3;
    relativeRotation: Mat33;
    friction: number;
    restitution: number;
    density: number;
    belongsTo: number;
    collidesWith: number;
}
/**
* An information of limit and motor.
*
* @author saharan
*/
export class LimitMotor {
    /**
    * An information of limit and motor.
    *
    * @author saharan
    */
    constructor(axis: any, fixed: any);
    axis: any;
    angle: number;
    lowerLimit: number;
    upperLimit: number;
    motorSpeed: number;
    maxMotorForce: number;
    frequency: number;
    dampingRatio: number;
}
/**
 * A hinge joint allows only for relative rotation of rigid bodies along the axis.
 *
 * @author saharan
 * @author lo-th
 */
export class HingeJoint {
    /**
     * A hinge joint allows only for relative rotation of rigid bodies along the axis.
     *
     * @author saharan
     * @author lo-th
     */
    constructor(config: any, lowerAngleLimit: any, upperAngleLimit: any);
    type: number;
    localAxis1: any;
    localAxis2: any;
    localAngle1: any;
    localAngle2: any;
    ax1: Vec3;
    ax2: Vec3;
    an1: Vec3;
    an2: Vec3;
    tmp: Vec3;
    nor: Vec3;
    tan: Vec3;
    bin: Vec3;
    limitMotor: LimitMotor;
    lc: LinearConstraint;
    r3: Rotational3Constraint;
}
/**
 * A ball-and-socket joint limits relative translation on two anchor points on rigid bodies.
 *
 * @author saharan
 * @author lo-th
 */
export class BallAndSocketJoint {
    /**
     * A ball-and-socket joint limits relative translation on two anchor points on rigid bodies.
     *
     * @author saharan
     * @author lo-th
     */
    constructor(config: any);
    type: number;
    lc: LinearConstraint;
}
/**
 * A distance joint limits the distance between two anchor points on rigid bodies.
 *
 * @author saharan
 * @author lo-th
 */
export class DistanceJoint {
    /**
     * A distance joint limits the distance between two anchor points on rigid bodies.
     *
     * @author saharan
     * @author lo-th
     */
    constructor(config: any, minDistance: any, maxDistance: any);
    type: number;
    nor: Vec3;
    limitMotor: LimitMotor;
    t: TranslationalConstraint;
}
/**
 * A prismatic joint allows only for relative translation of rigid bodies along the axis.
 *
 * @author saharan
 * @author lo-th
 */
export class PrismaticJoint {
    /**
     * A prismatic joint allows only for relative translation of rigid bodies along the axis.
     *
     * @author saharan
     * @author lo-th
     */
    constructor(config: any, lowerTranslation: any, upperTranslation: any);
    type: number;
    localAxis1: any;
    localAxis2: any;
    ax1: Vec3;
    ax2: Vec3;
    nor: Vec3;
    tan: Vec3;
    bin: Vec3;
    ac: AngularConstraint;
    limitMotor: LimitMotor;
    t3: Translational3Constraint;
}
/**
 * A slider joint allows for relative translation and relative rotation between two rigid bodies along the axis.
 *
 * @author saharan
 * @author lo-th
 */
export class SliderJoint {
    /**
     * A slider joint allows for relative translation and relative rotation between two rigid bodies along the axis.
     *
     * @author saharan
     * @author lo-th
     */
    constructor(config: any, lowerTranslation: any, upperTranslation: any);
    type: number;
    localAxis1: any;
    localAxis2: any;
    localAngle1: any;
    localAngle2: any;
    ax1: Vec3;
    ax2: Vec3;
    an1: Vec3;
    an2: Vec3;
    tmp: Vec3;
    nor: Vec3;
    tan: Vec3;
    bin: Vec3;
    rotationalLimitMotor: LimitMotor;
    r3: Rotational3Constraint;
    translationalLimitMotor: LimitMotor;
    t3: Translational3Constraint;
}
/**
 * A wheel joint allows for relative rotation between two rigid bodies along two axes.
 * The wheel joint also allows for relative translation for the suspension.
 *
 * @author saharan
 * @author lo-th
 */
export class WheelJoint {
    /**
     * A wheel joint allows for relative rotation between two rigid bodies along two axes.
     * The wheel joint also allows for relative translation for the suspension.
     *
     * @author saharan
     * @author lo-th
     */
    constructor(config: any);
    type: number;
    localAxis1: any;
    localAxis2: any;
    localAngle1: Vec3;
    localAngle2: any;
    ax1: Vec3;
    ax2: Vec3;
    an1: Vec3;
    an2: Vec3;
    tmp: Vec3;
    nor: Vec3;
    tan: Vec3;
    bin: Vec3;
    translationalLimitMotor: LimitMotor;
    rotationalLimitMotor1: LimitMotor;
    rotationalLimitMotor2: LimitMotor;
    t3: Translational3Constraint;
    r3: Rotational3Constraint;
}
export class JointConfig {
    scale: number;
    invScale: number;
    body1: any;
    body2: any;
    localAnchorPoint1: Vec3;
    localAnchorPoint2: Vec3;
    localAxis1: Vec3;
    localAxis2: Vec3;
    allowCollision: boolean;
}
/**
* The class of rigid body.
* Rigid body has the shape of a single or multiple collision processing,
* I can set the parameters individually.
* @author saharan
* @author lo-th
*/
export class RigidBody {
    /**
    * The class of rigid body.
    * Rigid body has the shape of a single or multiple collision processing,
    * I can set the parameters individually.
    * @author saharan
    * @author lo-th
    */
    constructor(Position: any, Rotation: any);
    position: any;
    orientation: any;
    scale: number;
    invScale: number;
    mesh: any;
    id: number;
    name: string;
    prev: any;
    next: any;
    type: number;
    massInfo: MassInfo;
    newPosition: Vec3;
    controlPos: boolean;
    newOrientation: Quat;
    newRotation: Vec3;
    currentRotation: Vec3;
    controlRot: boolean;
    controlRotInTime: boolean;
    quaternion: Quat;
    pos: Vec3;
    linearVelocity: Vec3;
    angularVelocity: Vec3;
    parent: any;
    contactLink: any;
    numContacts: number;
    shapes: any;
    numShapes: number;
    jointLink: any;
    numJoints: number;
    sleepPosition: Vec3;
    sleepOrientation: Quat;
    isStatic: boolean;
    isDynamic: boolean;
    isKinematic: boolean;
    rotation: Mat33;
    mass: number;
    inverseMass: number;
    inverseInertia: Mat33;
    localInertia: Mat33;
    inverseLocalInertia: Mat33;
    tmpInertia: Mat33;
    addedToIsland: boolean;
    allowSleep: boolean;
    sleepTime: number;
    sleeping: boolean;
}
/**
 * The class of physical computing world.
 * You must be added to the world physical all computing objects
 *
 * @author saharan
 * @author lo-th
 */
export class World {
    /**
     * The class of physical computing world.
     * You must be added to the world physical all computing objects
     *
     * @author saharan
     * @author lo-th
     */
    constructor(o: any);

    scale: any;
    invScale: number;
    timeStep: any;
    timerate: number;
    timer: any;
    preLoop: any;
    postLoop: any;
    numIterations: any;
    broadPhase: BruteForceBroadPhase | SAPBroadPhase | DBVTBroadPhase;
    Btypes: string[];
    broadPhaseType: string;
    performance: InfoDisplay;
    isStat: any;
    /**
     * Whether the constraints randomizer is enabled or not.
     *
     * @property enableRandomizer
     * @type {Boolean}
     */
    enableRandomizer: boolean;
    rigidBodies: any;
    numRigidBodies: number;
    contacts: any;
    unusedContacts: any;
    numContacts: number;
    numContactPoints: number;
    joints: any;
    numJoints: number;
    numIslands: number;
    gravity: Vec3;
    detectors: any[][];
    randX: number;
    randA: number;
    randB: number;
    islandRigidBodies: any[];
    islandStack: any[];
    islandConstraints: any[];

    play()

    stop()

    setGravity(ar)

    getInfo()

    // Reset the world and remove all rigid bodies, shapes, joints and any object from the world.
    clear()

    /**
     * I'll add a rigid body to the world.
     * Rigid body that has been added will be the operands of each step.
     * @param  rigidBody  Rigid body that you want to add
     */
    addRigidBody(rigidBody: RigidBody)

    /**
     * I will remove the rigid body from the world.
     * Rigid body that has been deleted is excluded from the calculation on a step-by-step basis.
     * @param  rigidBody  Rigid body to be removed
     */
    removeRigidBody(rigidBody: RigidBody)

    getByName(name)

    /**
     * I'll add a shape to the world..
     * Add to the rigid world, and if you add a shape to a rigid body that has been added to the world,
     * Shape will be added to the world automatically, please do not call from outside this method.
     * @param  shape  Shape you want to add
     */
    addShape(shape)

    /**
     * I will remove the shape from the world.
     * Add to the rigid world, and if you add a shape to a rigid body that has been added to the world,
     * Shape will be added to the world automatically, please do not call from outside this method.
     * @param  shape  Shape you want to delete
     */
    removeShape(shape)

    /**
     * I'll add a joint to the world.
     * Joint that has been added will be the operands of each step.
     */
    addJoint(joint: JointConfig)

    /**
     * I will remove the joint from the world.
     * Joint that has been added will be the operands of each step.
     */
    removeJoint(joint: JointConfig)

    addContact(s1, s2)

    removeContact(contact)

    getContact(b1, b2)

    checkContact(name1, name2)

    callSleep(body)

    /**
     * I will proceed only time step seconds time of World.
     */
    step()

    // remove someting to world
    remove(obj)

    // add someting to world
    add(o)

    initBody(type, o)

    initJoint(type, o)
}
export var REVISION: string;
export var BR_NULL: number;
export var BR_BRUTE_FORCE: number;
export var BR_SWEEP_AND_PRUNE: number;
export var BR_BOUNDING_VOLUME_TREE: number;
export var BODY_NULL: number;
export var BODY_DYNAMIC: number;
export var BODY_STATIC: number;
export var BODY_KINEMATIC: number;
export var BODY_GHOST: number;
export var SHAPE_NULL: number;
export var SHAPE_SPHERE: number;
export var SHAPE_BOX: number;
export var SHAPE_CYLINDER: number;
export var SHAPE_PLANE: number;
export var SHAPE_PARTICLE: number;
export var SHAPE_TETRA: number;
export var JOINT_NULL: number;
export var JOINT_DISTANCE: number;
export var JOINT_BALL_AND_SOCKET: number;
export var JOINT_HINGE: number;
export var JOINT_WHEEL: number;
export var JOINT_SLIDER: number;
export var JOINT_PRISMATIC: number;
export var AABB_PROX: number;
export function printError(clazz: any, msg: any): void;
export class InfoDisplay {
    constructor(world: any);
    parent: any;
    infos: Float32Array;
    f: number[];
    times: number[];
    broadPhase: any;
    version: string;
    fps: number;
    tt: number;
    broadPhaseTime: number;
    narrowPhaseTime: number;
    solvingTime: number;
    totalTime: number;
    updateTime: number;
    MaxBroadPhaseTime: number;
    MaxNarrowPhaseTime: number;
    MaxSolvingTime: number;
    MaxTotalTime: number;
    MaxUpdateTime: number;
}
/**
 * An axis-aligned bounding box.
 *
 * @author saharan
 * @author lo-th
 */
declare class AABB {
    /**
     * An axis-aligned bounding box.
     *
     * @author saharan
     * @author lo-th
     */
    constructor(minX: any, maxX: any, minY: any, maxY: any, minZ: any, maxZ: any);
    elements: Float32Array;
}
/**
* A linear constraint for all axes for various joints.
* @author saharan
*/
declare class LinearConstraint {
    /**
    * A linear constraint for all axes for various joints.
    * @author saharan
    */
    constructor(joint: any);
    m1: number;
    m2: number;
    ii1: any;
    ii2: any;
    dd: any;
    r1x: number;
    r1y: number;
    r1z: number;
    r2x: number;
    r2y: number;
    r2z: number;
    ax1x: number;
    ax1y: number;
    ax1z: number;
    ay1x: number;
    ay1y: number;
    ay1z: number;
    az1x: number;
    az1y: number;
    az1z: number;
    ax2x: number;
    ax2y: number;
    ax2z: number;
    ay2x: number;
    ay2y: number;
    ay2z: number;
    az2x: number;
    az2y: number;
    az2z: number;
    vel: number;
    velx: number;
    vely: number;
    velz: number;
    joint: any;
    r1: any;
    r2: any;
    p1: any;
    p2: any;
    b1: any;
    b2: any;
    l1: any;
    l2: any;
    a1: any;
    a2: any;
    i1: any;
    i2: any;
    impx: number;
    impy: number;
    impz: number;
}
/**
* A three-axis rotational constraint for various joints.
* @author saharan
*/
declare class Rotational3Constraint {
    /**
    * A three-axis rotational constraint for various joints.
    * @author saharan
    */
    constructor(joint: any, limitMotor1: any, limitMotor2: any, limitMotor3: any);
    cfm1: number;
    cfm2: number;
    cfm3: number;
    i1e00: number;
    i1e01: number;
    i1e02: number;
    i1e10: number;
    i1e11: number;
    i1e12: number;
    i1e20: number;
    i1e21: number;
    i1e22: number;
    i2e00: number;
    i2e01: number;
    i2e02: number;
    i2e10: number;
    i2e11: number;
    i2e12: number;
    i2e20: number;
    i2e21: number;
    i2e22: number;
    ax1: number;
    ay1: number;
    az1: number;
    ax2: number;
    ay2: number;
    az2: number;
    ax3: number;
    ay3: number;
    az3: number;
    a1x1: number;
    a1y1: number;
    a1z1: number;
    a2x1: number;
    a2y1: number;
    a2z1: number;
    a1x2: number;
    a1y2: number;
    a1z2: number;
    a2x2: number;
    a2y2: number;
    a2z2: number;
    a1x3: number;
    a1y3: number;
    a1z3: number;
    a2x3: number;
    a2y3: number;
    a2z3: number;
    lowerLimit1: number;
    upperLimit1: number;
    limitVelocity1: number;
    limitState1: number;
    enableMotor1: boolean;
    motorSpeed1: number;
    maxMotorForce1: number;
    maxMotorImpulse1: number;
    lowerLimit2: number;
    upperLimit2: number;
    limitVelocity2: number;
    limitState2: number;
    enableMotor2: boolean;
    motorSpeed2: number;
    maxMotorForce2: number;
    maxMotorImpulse2: number;
    lowerLimit3: number;
    upperLimit3: number;
    limitVelocity3: number;
    limitState3: number;
    enableMotor3: boolean;
    motorSpeed3: number;
    maxMotorForce3: number;
    maxMotorImpulse3: number;
    k00: number;
    k01: number;
    k02: number;
    k10: number;
    k11: number;
    k12: number;
    k20: number;
    k21: number;
    k22: number;
    kv00: number;
    kv11: number;
    kv22: number;
    dv00: number;
    dv11: number;
    dv22: number;
    d00: number;
    d01: number;
    d02: number;
    d10: number;
    d11: number;
    d12: number;
    d20: number;
    d21: number;
    d22: number;
    limitMotor1: any;
    limitMotor2: any;
    limitMotor3: any;
    b1: any;
    b2: any;
    a1: any;
    a2: any;
    i1: any;
    i2: any;
    limitImpulse1: number;
    motorImpulse1: number;
    limitImpulse2: number;
    motorImpulse2: number;
    limitImpulse3: number;
    motorImpulse3: number;
}
/**
* A translational constraint for various joints.
* @author saharan
*/
declare class TranslationalConstraint {
    /**
    * A translational constraint for various joints.
    * @author saharan
    */
    constructor(joint: any, limitMotor: any);
    cfm: number;
    m1: number;
    m2: number;
    i1e00: number;
    i1e01: number;
    i1e02: number;
    i1e10: number;
    i1e11: number;
    i1e12: number;
    i1e20: number;
    i1e21: number;
    i1e22: number;
    i2e00: number;
    i2e01: number;
    i2e02: number;
    i2e10: number;
    i2e11: number;
    i2e12: number;
    i2e20: number;
    i2e21: number;
    i2e22: number;
    motorDenom: number;
    invMotorDenom: number;
    invDenom: number;
    ax: number;
    ay: number;
    az: number;
    r1x: number;
    r1y: number;
    r1z: number;
    r2x: number;
    r2y: number;
    r2z: number;
    t1x: number;
    t1y: number;
    t1z: number;
    t2x: number;
    t2y: number;
    t2z: number;
    l1x: number;
    l1y: number;
    l1z: number;
    l2x: number;
    l2y: number;
    l2z: number;
    a1x: number;
    a1y: number;
    a1z: number;
    a2x: number;
    a2y: number;
    a2z: number;
    lowerLimit: number;
    upperLimit: number;
    limitVelocity: number;
    limitState: number;
    enableMotor: boolean;
    motorSpeed: number;
    maxMotorForce: number;
    maxMotorImpulse: number;
    limitMotor: any;
    b1: any;
    b2: any;
    p1: any;
    p2: any;
    r1: any;
    r2: any;
    l1: any;
    l2: any;
    a1: any;
    a2: any;
    i1: any;
    i2: any;
    limitImpulse: number;
    motorImpulse: number;
}
/**
* An angular constraint for all axes for various joints.
* @author saharan
*/
declare class AngularConstraint {
    /**
    * An angular constraint for all axes for various joints.
    * @author saharan
    */
    constructor(joint: any, targetOrientation: any);
    joint: any;
    targetOrientation: any;
    relativeOrientation: Quat;
    ii1: any;
    ii2: any;
    dd: any;
    vel: Vec3;
    imp: Vec3;
    rn0: Vec3;
    rn1: Vec3;
    rn2: Vec3;
    b1: any;
    b2: any;
    a1: any;
    a2: any;
    i1: any;
    i2: any;
}
/**
* A three-axis translational constraint for various joints.
* @author saharan
*/
declare class Translational3Constraint {
    /**
    * A three-axis translational constraint for various joints.
    * @author saharan
    */
    constructor(joint: any, limitMotor1: any, limitMotor2: any, limitMotor3: any);
    m1: number;
    m2: number;
    i1e00: number;
    i1e01: number;
    i1e02: number;
    i1e10: number;
    i1e11: number;
    i1e12: number;
    i1e20: number;
    i1e21: number;
    i1e22: number;
    i2e00: number;
    i2e01: number;
    i2e02: number;
    i2e10: number;
    i2e11: number;
    i2e12: number;
    i2e20: number;
    i2e21: number;
    i2e22: number;
    ax1: number;
    ay1: number;
    az1: number;
    ax2: number;
    ay2: number;
    az2: number;
    ax3: number;
    ay3: number;
    az3: number;
    r1x: number;
    r1y: number;
    r1z: number;
    r2x: number;
    r2y: number;
    r2z: number;
    t1x1: number;
    t1y1: number;
    t1z1: number;
    t2x1: number;
    t2y1: number;
    t2z1: number;
    l1x1: number;
    l1y1: number;
    l1z1: number;
    l2x1: number;
    l2y1: number;
    l2z1: number;
    a1x1: number;
    a1y1: number;
    a1z1: number;
    a2x1: number;
    a2y1: number;
    a2z1: number;
    t1x2: number;
    t1y2: number;
    t1z2: number;
    t2x2: number;
    t2y2: number;
    t2z2: number;
    l1x2: number;
    l1y2: number;
    l1z2: number;
    l2x2: number;
    l2y2: number;
    l2z2: number;
    a1x2: number;
    a1y2: number;
    a1z2: number;
    a2x2: number;
    a2y2: number;
    a2z2: number;
    t1x3: number;
    t1y3: number;
    t1z3: number;
    t2x3: number;
    t2y3: number;
    t2z3: number;
    l1x3: number;
    l1y3: number;
    l1z3: number;
    l2x3: number;
    l2y3: number;
    l2z3: number;
    a1x3: number;
    a1y3: number;
    a1z3: number;
    a2x3: number;
    a2y3: number;
    a2z3: number;
    lowerLimit1: number;
    upperLimit1: number;
    limitVelocity1: number;
    limitState1: number;
    enableMotor1: boolean;
    motorSpeed1: number;
    maxMotorForce1: number;
    maxMotorImpulse1: number;
    lowerLimit2: number;
    upperLimit2: number;
    limitVelocity2: number;
    limitState2: number;
    enableMotor2: boolean;
    motorSpeed2: number;
    maxMotorForce2: number;
    maxMotorImpulse2: number;
    lowerLimit3: number;
    upperLimit3: number;
    limitVelocity3: number;
    limitState3: number;
    enableMotor3: boolean;
    motorSpeed3: number;
    maxMotorForce3: number;
    maxMotorImpulse3: number;
    k00: number;
    k01: number;
    k02: number;
    k10: number;
    k11: number;
    k12: number;
    k20: number;
    k21: number;
    k22: number;
    kv00: number;
    kv11: number;
    kv22: number;
    dv00: number;
    dv11: number;
    dv22: number;
    d00: number;
    d01: number;
    d02: number;
    d10: number;
    d11: number;
    d12: number;
    d20: number;
    d21: number;
    d22: number;
    limitMotor1: any;
    limitMotor2: any;
    limitMotor3: any;
    b1: any;
    b2: any;
    p1: any;
    p2: any;
    r1: any;
    r2: any;
    l1: any;
    l2: any;
    a1: any;
    a2: any;
    i1: any;
    i2: any;
    limitImpulse1: number;
    motorImpulse1: number;
    limitImpulse2: number;
    motorImpulse2: number;
    limitImpulse3: number;
    motorImpulse3: number;
    cfm1: number;
    cfm2: number;
    cfm3: number;
    weight: number;
}
/**
 * This class holds mass information of a shape.
 * @author lo-th
 * @author saharan
 */
declare class MassInfo {
    mass: number;
    inertia: Mat33;
}
/**
* A broad-phase algorithm with brute-force search.
* This always checks for all possible pairs.
*/
declare class BruteForceBroadPhase {
    types: number;
    proxies: any[];
}
/**
 * A broad-phase collision detection algorithm using sweep and prune.
 * @author saharan
 * @author lo-th
 */
declare class SAPBroadPhase {
    types: number;
    numElementsD: number;
    numElementsS: number;
    axesD: SAPAxis[];
    axesS: SAPAxis[];
    index1: number;
    index2: number;
}
/**
 * A broad-phase algorithm using dynamic bounding volume tree.
 *
 * @author saharan
 * @author lo-th
 */
declare class DBVTBroadPhase {
    types: number;
    tree: DBVT;
    stack: any[];
    leaves: any[];
    numLeaves: number;
}
/**
 * A projection axis for sweep and prune broad-phase.
 * @author saharan
 */
declare class SAPAxis {
    numElements: number;
    bufferSize: number;
    elements: any[];
    stack: Float32Array;
}
/**
 * A dynamic bounding volume tree for the broad-phase algorithm.
 *
 * @author saharan
 * @author lo-th
 */
declare class DBVT {
    root: any;
    freeNodes: any[];
    numFreeNodes: number;
    aabb: AABB;
}
export { _Math as Math };
