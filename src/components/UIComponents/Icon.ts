import {CanvasItem} from '../ItemManager';
import {Vector3} from 'three';
interface IconConfig{
    id: string;
    width: number;
    height: number;
    left: number;
    top: number;
}
/**
 * 根据一组参数创建Icon，然后动态创建Item
 * 适合将游戏所有icon集成在一个图片中，然后统一加载应用
 */
export class Icon {
    /**
     * 
     * @param image 
     * @param config 
     * @param createCanvasFunc wx.createCanvas 
     */
    image: HTMLImageElement;
    config: IconConfig[];
    createCanvasFunc: any;
    constructor(image: HTMLImageElement, config: IconConfig[], createCanvasFunc: any){
        this.image = image;
        this.config = config;
        this.createCanvasFunc = createCanvasFunc;
    }
    createIcon(id: string, position: Vector3, opacity = 1, radio = 1): CanvasItem | undefined{
        let config = undefined;
        for(let i=0;i<this.config.length;i++){
            if(this.config[i].id === id){
                config = this.config[i];
                break;
            }
        }
        if(config !== undefined){
            let canvas = this.createCanvasFunc();
            canvas.width = config.width * radio;
            canvas.height = config.height * radio;
            let ctx = canvas.getContext('2d');
            ctx.drawImage(this.image, config.left, config.top, config.width, config.height, 0, 0, config.width, config.height);
            let item = new CanvasItem(position, config.width, config.height, canvas, opacity);
            return item;
        }
        return undefined;
    }
}