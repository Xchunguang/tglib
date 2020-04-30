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
// 创建之后需要全局只有一个对象
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
    sliceTime: number;
    /**
     * 初始化
     * @param control 控制中心
     * @param createCanvasFunc wx.createCanvas
     * @param background 背景颜色
     * @param radius 圆角
     * @param time 展示时间
     * @param sliceTime 收回时间
     */
    constructor(control: Control, createCanvasFunc: any, background: string, radius: number, time: number, sliceTime: number){
        this.control = control;
        this.background = background;
        this.radius = radius;
        this.time = time;
        this.sliceTime = sliceTime;
        this.canvas = createCanvasFunc();
        this.canvas.width = window.innerWidth * window.devicePixelRatio;
        this.canvas.height = window.innerHeight * window.devicePixelRatio;
        this.canCtx = this.canvas.getContext('2d');
        if(this.canCtx !== null){
            this.canCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
        this.item = new CanvasItem(new Vector3(0,0,0), window.innerWidth, window.innerHeight, this.canvas);
        this.item.setTouchEvent(this.close.bind(this));

        if(this.item.mesh !== undefined){
            this.animateItem = new AnimateItem(this.item.mesh, AnimateType.ONCE, AnimateMode.SHAPE, this.sliceTime);
            this.closeAnimateItem = new AnimateItem(this.item.mesh, AnimateType.ONCE, AnimateMode.SHAPE, this.sliceTime);
        }
    }
    /**
     * 展示多行文本提示
     * @param textArr 文本列表 [text: '', fontSize: 15, color: '#fff']
     * @param width toast宽度
     * @param height toast高度
     * @param top toast距上方的距离
     * @param paddingTop toast内部上边距
     */
    showLines(textArr: TextConfig[], width=window.innerWidth * 0.6, height= window.innerHeight * 0.2, top = window.innerHeight * 0.2, paddingTop = window.innerHeight * 0.1): void{
        this.clear();
        if(this.canCtx !== null && this.item.mesh !== undefined){
            this.canCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            let left = ( window.innerWidth - width ) / 2;
            this.fillRoundRect(this.canCtx, left, top, width, height, this.radius, this.background);
            this.canCtx.textAlign = 'center';
            let fontTotalHeight = 0;
            for(let i=0;i<textArr.length;i++){
                let text = textArr[i];
                let deviceFontSize = text.fontSize * window.devicePixelRatio;
                this.canCtx.font = deviceFontSize + 'px " 宋体';
                this.canCtx.fillStyle = text.color;
                this.canCtx.fillText(text.text, window.innerWidth * 0.5, top + paddingTop + fontTotalHeight);
                fontTotalHeight = fontTotalHeight + deviceFontSize + 5;
            }
            this.animate();
        }
    }
    /**
     * 展示单行文本
     * @param text 文本
     * @param fontSize 字体大小
     * @param color 字体颜色
     * @param width 字体宽度
     * @param height 字体高度
     * @param top toast距上方的距离
     * @param paddingTop toast内部上边距
     */
    show(text: string, fontSize: 10, color = '#ffffff', width = window.innerWidth * 0.6, height = window.innerHeight * 0.2, top = window.innerHeight * 0.2, paddingTop = window.innerHeight * 0.1): void{
        this.clear();
        if(this.canCtx !== null){
            this.canCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            let left = ( window.innerWidth - width ) / 2;
            this.fillRoundRect(this.canCtx, left, top, width, height, this.radius, this.background);
            this.canCtx.font = fontSize * window.devicePixelRatio + 'px " 宋体';
            this.canCtx.fillStyle = color;
            this.canCtx.textAlign = 'center';
            this.canCtx.fillText(text, window.innerWidth * 0.5, top + paddingTop);
            this.animate();
        }
    }
    /**
     * 关闭
     */
    close(): void{
        if(this.closeAnimateItem !== undefined){
            this.closeAnimateItem.pause();
            this.closeAnimateItem.setTargetPosition(new Vector3(0,1,1), 0, Power4.easeIn);
            this.closeAnimateItem.action(this.clear.bind(this));
        }
    }
    /**
     * 动画
     */
    private animate(): void{
        if(this.item.mesh !== undefined){
            this.item.mesh.scale.set(0,1,1);
            this.item.update();
            this.control.itemManager.addHudItem(this.item);

            if(this.animateItem !== undefined && this.closeAnimateItem !== undefined){
                this.animateItem.setTargetPosition(new Vector3(1,1,1), 0, Power4.easeIn);
                this.animateItem.action();

                this.closeAnimateItem.setTargetPosition(new Vector3(0,1,1), this.time + this.sliceTime, Power4.easeIn);
                this.closeAnimateItem.action(this.clear.bind(this));
            }
        }
    }
    /**
     * 移出
     */
    private clear(): void{
        if(this.item.uuid !== undefined){
            if(this.closeAnimateItem !== undefined){
                this.closeAnimateItem.pause();
            }
            this.control.itemManager.remove(this.item.uuid);
        }
    }
    /**
     * 绘制带圆角的矩形
     * @param cxt
     * @param width
     * @param height
     * @param radius
     */
    private fillRoundRect(cxt: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fillColor: string) {
        if (2 * radius > width || 2 * radius > height) { return false; }
        cxt.save();
        cxt.translate(x, y);
        this.drawRoundRectPath(cxt, width, height, radius);
        cxt.fillStyle = fillColor || "#000";
        cxt.fill();
        cxt.restore();
    }
    /**
     * 绘制带圆角的矩形
     * @param cxt
     * @param width
     * @param height
     * @param radius
     */
    private drawRoundRectPath(cxt: CanvasRenderingContext2D, width: number, height: number, radius: number) {
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
/**
 * 封装的文本Toast，带有默认值
 */
export class TextToast extends Toast{
    constructor(control: Control, createCanvasFunc: any, background='rgba(0,0,0,0.7)', radius=10, time=3, sliceTime=0.5){
        super(control, createCanvasFunc, background, radius, time, sliceTime);
    }
}
