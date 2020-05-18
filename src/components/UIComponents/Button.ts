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
  borderWidth: number
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
  borderWidth: 0,
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
    canvas.width = width * window.devicePixelRatio
    canvas.height = height * window.devicePixelRatio
    this.canvas = canvas
    this.position = position
    this.width = width
    this.height = height
    this.config = config
    this.setTouchEvent(this.btnTouchEvent.bind(this))
    this.setTouchLeaveEvent(this.btnTouchLeaveEvent.bind(this))
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
  protected fillRoundRect(cxt: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fillColor: string) {
    if (2 * radius > width || 2 * radius > height) { return false; }
    cxt.save();
    cxt.translate(x, y);
    this.drawRoundRectPath(cxt, width, height, radius);
    if(fillColor){
      cxt.fillStyle = fillColor; // 填充色
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
 * 图片button默认平铺满
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
    this.draw()
    this.update()
  }
  roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
    ctx.lineTo(x + width - radius, y + height);
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    ctx.lineTo(x + width, y + radius);
    ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
    ctx.lineTo(x + radius, y);
    ctx.quadraticCurveTo(x, y, x, y + radius);
    ctx.stroke();
  }
  draw(){
    let config = this.icon.getConfig(this.id) // 图片配置
    let ctx = this.canvas.getContext('2d')
    ctx.scale(this.radio, this.radio)
    if(config !== undefined){
      ctx.save();
      ctx.beginPath();
      this.roundedRect(ctx, 0, 0, this.width, this.height, this.config.borderRadius);
      ctx.clip();  // 通过裁剪得到圆角矩形
      ctx.drawImage(this.icon.image, config.left, config.top, config.width, config.height, 0, 0, this.width, this.height)
    }
  }
  btnTouchDraw(){
    return
  }
  btnTouchLeaveDraw(){
    return
  }
}

/**
 * 文字button，文字button默认居中
 */
export class TextButton extends Button{
  text: string
  color: string
  fontSize: number
  constructor(text: string, color: string, fontSize: number,canvas: any, position: Vector3,width: number, height: number, config=defaultConfig){
    super(position, width, height, canvas, config)
    this.text = text
    this.color = color
    this.fontSize = fontSize
    this.draw()
    this.update()
  }
  draw(){
    let ctx = this.canvas.getContext('2d')
    // 绘制边框
    if(this.config.borderColor !== undefined && this.config.borderWidth > 0){
      this.fillRoundRect(ctx, 0, 0, this.width, this.height, this.config.borderRadius, this.config.borderColor)
    }
    // 绘制背景
    if(this.config.background !== undefined){
      this.fillRoundRect(ctx, this.config.borderWidth, this.config.borderWidth, this.width - this.config.borderWidth * 2, this.height - this.config.borderWidth * 2, this.config.borderRadius, this.config.background)
    }
    // 绘制文字
    ctx.font = this.fontSize + 'px 宋体'
    ctx.fillStyle = this.color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(this.text, this.width / 2, this.height / 2);
  }
}
