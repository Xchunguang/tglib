import { Object3D, Vector3, Euler } from "three";
/**
 * 动画类型
 */
export enum AnimateType {
    ONCE,//单次运动
    RETURN,//往返运动
    REPEAT//重复运动
}
/**
 * 动画方式
 */
export enum AnimateMode{
    ROTATE,//自转
    EULER,//欧拉旋转
    MOVE,//位移
    SHAPE//形变
}
export class AnimateControl{
    animates: AnimateItem[];
    constructor(){
        this.animates = [];
    }
    /**
     * 初始化
     */
    start(): void{

    }
    stop(): void{

    }
    add(item: AnimateItem): void{

    }
    remove(uuid: string): void{

    }
    pause(): void{

    }
}

export class AnimateItem{
    uuid: string;
    mesh: Object3D;
    time: number;//单次运行时间
    type: AnimateType;
    mode: AnimateMode;
    targetPosition: Vector3 | undefined;
    euler: Euler | undefined;
    constructor(mesh: Object3D, type: AnimateType, mode: AnimateMode, time: number){
        this.mesh = mesh;
        this.uuid = mesh.uuid;
        this.type = type;
        this.mode = mode;
        this.time = time;
    }
    /**
     * 位移参数
     * @param position 
     */
    setTargetPosition(position: Vector3): void{
        this.targetPosition = position;
    }
    /**
     * 旋转参数
     * @param euler this.mesh.position.applyEuler(euler)
     */
    setEuler(euler: Euler): void{
        this.euler = euler;
    }
}