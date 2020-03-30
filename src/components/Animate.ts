import { Object3D, Vector3, Euler } from "three";
import {TweenMax} from 'gsap';
import {Power0} from 'gsap';
export {Power0, Power1, Power2, Power3, Power4, Linear, Quad, Cubic, Quart, Quint, Strong} from 'gsap';

/**
 * 动画类型
 */
export enum AnimateType {
    ONCE,// 单次运动
    RETURN,// 往返运动
    REPEAT,// 重复运动
    RETURNREPEAT,// 往返重复
}
/**
 * 动画方式
 */
export enum AnimateMode{
    ROTATE,// 自转
    EULER,// 欧拉旋转
    MOVE,// 位移
    SHAPE// 形变
}

export class MoveItem{
    uuid: string;
    mesh: Object3D;
    time: number;// 单次运行时间，单位秒
    type: AnimateType;
    animate: any;
    //位移参数：
    targetPosition: Vector3 | undefined;
    delay = 0;
    easeType = Power0.easeNone;
    constructor(mesh: Object3D, type: AnimateType, time: number){
        this.mesh = mesh;
        this.uuid = mesh.uuid;
        this.type = type;
        this.time = time;
    }
    /**
     * 设置位移参数
     * @param position 
     */
    setTargetPosition(position: Vector3, delay=0, easeType = Power0.easeNone): void{
        this.targetPosition = position;
        this.delay = delay;
        this.easeType = easeType;
    }
    action(): void{
        if(this.targetPosition !== undefined){
            if(this.type === AnimateType.ONCE){
                this.animate = TweenMax.to(this.mesh.position, this.time, {x: this.targetPosition.x, y: this.targetPosition.y, z: this.targetPosition.z, delay: this.delay, ease: this.easeType});
            } else if (this.type === AnimateType.REPEAT){
                this.animate = TweenMax.to(this.mesh.position, this.time, {x: this.targetPosition.x, y: this.targetPosition.y, z: this.targetPosition.z, delay: this.delay, ease: this.easeType, repeat: -1});
            } else if (this.type === AnimateType.RETURN){
                this.animate = TweenMax.to(this.mesh.position, this.time, {x: this.targetPosition.x, y: this.targetPosition.y, z: this.targetPosition.z, delay: this.delay, ease: this.easeType, yoyo: true});
            } else if (this.type === AnimateType.RETURNREPEAT){
                this.animate = TweenMax.to(this.mesh.position, this.time, {x: this.targetPosition.x, y: this.targetPosition.y, z: this.targetPosition.z, delay: this.delay, ease: this.easeType, yoyo: true, repeat: -1});
            } 
        }
    }
    pause(): void{
        if(this.animate && this.animate.pause){
            this.animate.pause();
        }
    }
    resume(): void{
        if(this.animate && this.animate.resume){
            this.animate.resume();
        }
    }
}