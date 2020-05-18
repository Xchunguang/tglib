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

export class AnimateItem{
    uuid: string;
    mesh: Object3D;
    time: number;// 单次运行时间，单位秒
    type: AnimateType;
    mode: AnimateMode;
    animate: any;
    // 位移参数/自转参数/形变参数：
    targetPosition: Vector3 | undefined;
    delay = 0;
    easeType = Power0.easeNone;
    /**
     * 初始化
     * @param mesh threejs 3D对象
     * @param type 动画类型
     * @param mode 运动方式
     * @param time 动画持续时间
     */
    constructor(mesh: Object3D, type: AnimateType, mode: AnimateMode, time: number){
        this.mesh = mesh;
        this.uuid = mesh.uuid;
        this.type = type;
        this.time = time;
        this.mode = mode;
    }
    /**
     * 设置变换参数
     * @param position
     */
    setTargetPosition(position: Vector3, delay=0, easeType = Power0.easeNone): void{
        this.targetPosition = position;
        this.delay = delay;
        this.easeType = easeType;
    }
    /**
     * 执行动画
     * @param callback 执行完成之后的回调函数
     */
    action(callback?: any): void{
        if(this.targetPosition !== undefined){
            let animateObj = undefined;
            let callbackFunc = function(){
                if(callback){
                    callback();
                }
            }
            if(this.type === AnimateType.ONCE){
                animateObj = {x: this.targetPosition.x, y: this.targetPosition.y, z: this.targetPosition.z, delay: this.delay, ease: this.easeType, onComplete: callbackFunc};
            } else if (this.type === AnimateType.REPEAT){
                animateObj = {x: this.targetPosition.x, y: this.targetPosition.y, z: this.targetPosition.z, delay: this.delay, ease: this.easeType, repeat: -1, onComplete: callbackFunc};
            } else if (this.type === AnimateType.RETURN){
                animateObj = {x: this.targetPosition.x, y: this.targetPosition.y, z: this.targetPosition.z, delay: this.delay, ease: this.easeType, yoyo: true, repeat: 1, onComplete: callbackFunc};
            } else if (this.type === AnimateType.RETURNREPEAT){
                animateObj = {x: this.targetPosition.x, y: this.targetPosition.y, z: this.targetPosition.z, delay: this.delay, ease: this.easeType, yoyo: true, repeat: -1, onComplete: callbackFunc};
            }
            if(animateObj !== undefined){
                if(this.mode === AnimateMode.MOVE){
                    this.animate = TweenMax.to(this.mesh.position, this.time, animateObj);
                } else if(this.mode === AnimateMode.ROTATE){
                    let eulrObj = {_x: animateObj.x, _y: animateObj.y,_z: animateObj.z}
                    this.animate = TweenMax.to(this.mesh.rotation, this.time, eulrObj);
                } else if(this.mode === AnimateMode.SHAPE){
                    this.animate = TweenMax.to(this.mesh.scale, this.time, animateObj);
                }
            }
        }
    }
    /**
     * 暂停播放
     */
    pause(): void{
        if(this.animate && this.animate.pause){
            this.animate.pause();
        }
    }
    /**
     * 恢复播放
     */
    resume(): void{
        if(this.animate && this.animate.resume){
            this.animate.resume();
        }
    }
}
