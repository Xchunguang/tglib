import { Control } from "../Control";
import { CanvasItem } from "../ItemManager";
import { Vector3 } from "three";
import { AnimateItem, AnimateType, AnimateMode } from "../Animate";
import {Power4} from 'gsap';
interface TextConfig{
    text: string;
    fontSize: number;
    color: string;
}
//创建之后需要全局只有一个对象
export class Toast{
    control: Control;
    background: string;
    radius: number;
    time: number;// 多长时间自动收回
    canvas: HTMLCanvasElement;
    canCtx: CanvasRenderingContext2D | null;
    item: CanvasItem;
    animateItem: AnimateItem | undefined;
    closeAnimateItem: AnimateItem | undefined;
    constructor(control: Control, createCanvasFunc: any, background: string, radius: number, time: number){
        this.control = control;
        this.background = background;
        this.radius = radius;
        this.time = time;
        this.canvas = createCanvasFunc();
        this.canvas.width = window.innerWidth * window.devicePixelRatio;
        this.canvas.height = window.innerHeight * window.devicePixelRatio;
        this.canCtx = this.canvas.getContext('2d');
        if(this.canCtx !== null){
            this.canCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
        this.item = new CanvasItem(new Vector3(0,0,0), window.innerWidth, window.innerHeight, this.canvas);
        this.item.setTouchEvent(this.clear.bind(this));
    }
    showLines(textArr: TextConfig[], width=window.innerWidth * 0.6, height= window.innerHeight * 0.2): void{

    }
    show(text: string, width=window.innerWidth * 0.6, height= window.innerHeight * 0.2): void{
        this.clear();
        if(this.canCtx !== null && this.item.mesh !== undefined){
            this.canCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            let left = ( window.innerWidth - width ) / 2;
            let top = window.innerHeight * 0.2;
            this.fillRoundRect(this.canCtx, left, top, width, height, this.radius, this.background);
            this.canCtx.font = 10 * window.devicePixelRatio + 'px " 宋体';
            this.canCtx.fillStyle = '#ffffff';
            this.canCtx.textAlign = 'center';
            this.canCtx.fillText(text, window.innerWidth * 0.5, window.innerHeight * 0.3); 
            this.item.mesh.scale.set(0,0,0);
            this.item.update();
            this.control.itemManager.addHudItem(this.item);
            this.animateItem = new AnimateItem(this.item.mesh, AnimateType.ONCE, AnimateMode.SHAPE, 1);
            this.animateItem.setTargetPosition(new Vector3(1,1,1), 0, Power4.easeIn);
            this.animateItem.action();

            this.closeAnimateItem = new AnimateItem(this.item.mesh, AnimateType.ONCE, AnimateMode.SHAPE, 1);
            this.closeAnimateItem.setTargetPosition(new Vector3(0,0,0), this.time + 1, Power4.easeIn);
            this.closeAnimateItem.action(this.clear.bind(this));
        }
    }
    clear(): void{
        if(this.item.uuid !== undefined){
            this.control.itemManager.remove(this.item.uuid);
        }
    }
    fillRoundRect(cxt: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fillColor: string) {
        if (2 * radius > width || 2 * radius > height) { return false; }
        cxt.save();
        cxt.translate(x, y);
        this.drawRoundRectPath(cxt, width, height, radius);
        cxt.fillStyle = fillColor || "#000"; 
        cxt.fill();
        cxt.restore();
    }
    drawRoundRectPath(cxt: CanvasRenderingContext2D, width: number, height: number, radius: number) {
        cxt.beginPath();
        cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);
        cxt.lineTo(radius, height);
        cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);
        cxt.lineTo(0, radius);
        cxt.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);
        cxt.lineTo(width - radius, 0);
        cxt.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);
        cxt.lineTo(width, height - radius);
        cxt.closePath();
    }
}
export class TextToast extends Toast{
    constructor(control: Control, createCanvasFunc: any, background='rgba(0,0,0,0.7)', radius=10, time=3){
        super(control, createCanvasFunc, background, radius, time);
    }
}