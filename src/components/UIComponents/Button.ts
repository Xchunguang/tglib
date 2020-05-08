import { CanvasItem } from "../ItemManager"
import { Vector3 } from "three"
import { Icon } from "./Icon"

/**
 * 按钮组件
 * 属性：
 *
 * 背景颜色
 * 边框颜色
 * 点击背景颜色
 * 点击边框颜色
 * 禁用颜色
 * 圆角
 * 宽度
 * 高度
 * 点击事件
 *
 * 图片按钮：（默认铺满）
 * 按钮背景图片
 * 图片宽度
 * 图片高度
 * 图片top
 * 图片left
 *
 * 文字按钮：（默认居中）
 * 按钮文字
 * 按钮文字字体大小
 * 按钮文字字体颜色
 *
 *
 * 方法：
 * 禁用
 * 启用
 *
 *
 */
interface ButtonConfig {
  background: string | undefined
  borderColor: string | undefined
  activeBackground: string | undefined
  activeBorderColor: string | undefined
  disableColor: string
  borderRadius: number
  disable: boolean
  onclick: Function | undefined
}

const defaultConfig: ButtonConfig = {
  background: undefined,
  borderColor: undefined,
  activeBackground:  undefined,
  activeBorderColor: undefined,
  disableColor: '#ccc',
  borderRadius: 3,
  disable: false,
  onclick: undefined
}

class Button extends CanvasItem{
  position: Vector3
  width: number
  height: number
  canvas: any
  config: ButtonConfig
  touchStatus = false
  constructor(position:Vector3,width: number, height: number, canvas: any, config=defaultConfig){
    super(position, width, height, canvas)
    this.canvas = canvas
    this.position = position
    this.width = width
    this.height = height
    this.config = config
    this.draw()
    this.update()
  }
  // tslint:disable-next-line: no-empty
  draw(){

  }
  // 禁用时执行的绘制
  // tslint:disable-next-line: no-empty
  disableDraw(){

  }
  setDisable(disable: boolean){
    this.config.disable = disable
    this.disableDraw()
  }
  // 触摸时执行的绘制，需要子类自行实现
  // tslint:disable-next-line: no-empty
  btnTouchDraw(){

  }
  btnTouchEvent(){
    this.touchStatus = true;
    this.btnTouchDraw()
  }
  // 触摸离开时执行的绘制，需要子类自行实现
  // tslint:disable-next-line: no-empty
  btnTouchLeaveDraw(){

  }
  btnTouchLeaveEvent(){
    if(this.touchStatus === true){
      if(this.config.onclick !== undefined){
        this.config.onclick()
      }
      this.btnTouchLeaveDraw()
      this.touchStatus = false
    }
  }
  protected fillRoundRect(cxt: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fillColor: string, borderColor: string, borderWidth: number) {
    if (2 * radius > width || 2 * radius > height) { return false; }
    cxt.save();
    cxt.translate(x, y);
    this.drawRoundRectPath(cxt, width, height, radius);
    if(fillColor){
      cxt.fillStyle = fillColor; // 填充色
    }
    if(borderColor){
      cxt.strokeStyle = borderColor || "red"; // 边框
      cxt.lineWidth = borderWidth || 5; // 边框粗细
    }
    cxt.fill();
    cxt.stroke();
    cxt.restore();
  }
  protected drawRoundRectPath(cxt: CanvasRenderingContext2D, width: number, height: number, radius: number) {
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
 * 图片button，必须配合Icon使用
 */
export class ImageButton extends Button{
  icon: Icon
  id: string
  position: Vector3
  radio: number
  constructor(icon: Icon, id: string, position: Vector3,width: number, height: number, radio=1, config=defaultConfig){
    let canvas = icon.createCanvasFunc();
    canvas.width = width * radio;
    canvas.height = height * radio;
    super(position, width, height, canvas, config)
    this.icon = icon
    this.id = id
    this.position = position
    this.radio = radio
  }
  draw(){

  }
  btnTouchDraw(){

  }
  btnTouchLeaveDraw(){

  }
}

export class TextButton extends Button{

}
