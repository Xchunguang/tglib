import { Control } from './Control'
import {
  Vector3,
  Mesh,
  TextureLoader,
  Texture,
  MeshBasicMaterial,
  PlaneGeometry,
  CanvasTexture,
  Object3D,
  Raycaster
} from 'three'
let instance: ItemManager
/**
 * 元素管理器
 */
export class ItemManager {
  control: Control
  items: Item[]
  hudItems: Item[]
  /**
   * 初始化
   * @param control 控制中心，元素管理器依赖控制中心
   */
  constructor(control: Control) {
    instance = this
    this.control = control
    this.items = []
    this.hudItems = []
    this.initTouchHandler()
  }
  /**
   * 添加主场景元素
   * @param item
   */
  addItem(item: Item): void {
    if (item.mesh !== undefined) {
      instance.items.push(item)
      instance.control.addMesh(item.mesh)
    }
  }
  /**
   * 添加hud场景元素
   * @param item
   */
  addHudItem(item: Item): void {
    if (item.mesh !== undefined) {
      instance.hudItems.push(item)
      instance.control.addHudMesh(item.mesh)
    }
  }
  /**
   * 根据元素的uuid查找元素对象
   * @param uuid
   */
  getItem(uuid: string): Item | undefined {
    for (let i = 0; i < instance.items.length; i++) {
      if (instance.items[i].uuid === uuid) {
        return instance.items[i]
      }
    }
    for (let i = 0; i < instance.hudItems.length; i++) {
      if (instance.hudItems[i].uuid === uuid) {
        return instance.hudItems[i]
      }
    }
    return undefined
  }
  /**
   * 根据元素uuid将元素移除场景
   * @param uuid
   */
  remove(uuid: string): void {
      let itemIndex = -1
      for (let i = 0; i < instance.items.length; i++) {
        if (instance.items[i].uuid === uuid) {
          itemIndex = i
          break
        }
      }
      if (itemIndex >= 0) {
        let item: Item = instance.items.splice(itemIndex, 1)[0]
        if (item.mesh !== undefined) {
          instance.control.removeMesh(item.mesh)
          return
        }
      }
      let hudIndex = -1
      for (let i = 0; i < instance.hudItems.length; i++) {
        if (instance.hudItems[i].uuid === uuid) {
          hudIndex = i
          break
        }
      }
      if (hudIndex >= 0) {
        let item: Item = instance.hudItems.splice(hudIndex, 1)[0]
        if (item.mesh !== undefined) {
          instance.control.removeMesh(item.mesh)
        }
      }
  }
  /**
   * 注册触摸事件，禁止外部调用
   */
  private initTouchHandler(): void {
    instance.control.canvas.addEventListener('touchstart', instance.touchHandler.bind(this))
    instance.control.canvas.addEventListener('touchend', instance.touchLeaveHandler.bind(this))
  }
  /**
   * 移除触摸事件，禁止外部调用
   */
  private removeTouchHandler(): void {
    instance.control.canvas.removeEventListener('touchstart', instance.touchHandler.bind(this))
    instance.control.canvas.removeEventListener('touchend', instance.touchLeaveHandler.bind(this))
  }
  /**
   * 触摸事件处理，禁止外部调用
   * 使用射线判断是否点击到元素上，目前未处理元素重叠情况，若元素重叠，将会执行所有重叠的元素的点击事件
   * @param e
   */
  private touchHandler(e: any): void {
    e.preventDefault()
    let itemArr = this.getTouchItems(e.touches[0]);
    if(itemArr.length > 0){
      for(let i=0;i<itemArr.length;i++){
        if(itemArr[i].touchEvent){
          itemArr[i].touchEvent();
        }
      }
    }
  }
  /**
   * 触摸离开事件处理
   * @param e
   */
  private touchLeaveHandler(e: any): void{
    e.preventDefault()
    let itemArr = this.getTouchItems(e.changedTouches[0]);
    if(itemArr.length > 0){
      for(let i=0;i<itemArr.length;i++){
        if(itemArr[i].touchLeaveEvent){
          itemArr[i].touchLeaveEvent();
        }
      }
    }
  }

  /**
   * 获得触摸事件经过的所有元素
   * @param e
   */
  private getTouchItems(touch: Touch): Item[] {
    let item: Item[] = [];
    try{
      let x = touch.clientX
      let y = touch.clientY
      x = (x / window.innerWidth) * 2 - 1
      y = -(y / window.innerHeight) * 2 + 1
      let mouseVector = new Vector3(x, y, 0.5)
      // 判断stage中的元素
      if (this.items.length > 0) {
        let raycaster = new Raycaster()
        raycaster.setFromCamera(mouseVector, this.control.stage.camera)
        for (let i = 0; i < this.items.length; i++) {
          let curItem = this.items[i]
          if (curItem.touchEvent && curItem.touchEvent !== null && curItem.mesh !== undefined) {
            let arr = raycaster.intersectObject(curItem.mesh, true)
            if (
              arr.length > 0 &&
              arr[0].object &&
              arr[0].object.uuid &&
              arr[0].object.uuid === curItem.mesh.uuid
            ) {
              item.push(curItem);
            }
          }
        }
      }
      // 判断hudStage中的元素
      if (instance.hudItems.length > 0 && instance.control.hudStage !== undefined) {
        let hudRaycaster = new Raycaster()
        hudRaycaster.setFromCamera(mouseVector, instance.control.hudStage.camera)
        for (let i = 0; i < instance.hudItems.length; i++) {
          let curItem = instance.hudItems[i]
          if (curItem.touchEvent && curItem.touchEvent !== null && curItem.mesh !== undefined) {
            let arr = hudRaycaster.intersectObject(curItem.mesh, true)
            if (
              arr.length > 0 &&
              arr[0].object &&
              arr[0].object.uuid &&
              arr[0].object.uuid === curItem.mesh.uuid
            ) {
              item.push(curItem);
            }
          }
        }
      }
    }catch(e){
      return item;
    }
    return item;
  }
}
/**
 * 元素定义
 */
export class Item {
  uuid: string | undefined
  width: number | undefined
  height: number | undefined
  mesh: Object3D | undefined
  touchEvent: any
  touchLeaveEvent: any
  /**
   * 初始化
   * @param width 元素宽度
   * @param height 元素高度
   * @param mesh 元素对象
   */
  constructor(width: number, height: number, mesh: Object3D | undefined) {
    this.width = width
    this.height = height
    this.mesh = mesh
    if (mesh !== undefined) {
      this.uuid = mesh.uuid
    }
  }
  /**
   * 设置元素
   * @param mesh
   */
  setMesh(mesh: Object3D): void {
    this.mesh = mesh
  }
  /**
   * 设置触摸事件
   * @param touchEvent function
   */
  setTouchEvent(touchEvent: any): void {
    this.touchEvent = touchEvent
  }
  /**
   * 设置触摸移开事件
   * @param touchLeaveEvent
   */
  setTouchLeaveEvent(touchLeaveEvent: any): void{
    this.touchLeaveEvent = touchLeaveEvent
  }
  /**
   * 判断是否是同一元素
   * @param item
   */
  equals(item: Item): boolean {
    return this.uuid === item.uuid
  }
  /**
   * 卸载元素
   */
  dispose(): void {
    if (this.mesh !== undefined) {
      this.mesh = undefined
    }
  }
}
/**
 * 图片元素
 */
export class ImageItem extends Item {
  imgSrc: string
  constructor(position: Vector3, width: number, height: number, imgSrc: string) {
    let texture = new TextureLoader().load(imgSrc)
    let material = new MeshBasicMaterial({ map: texture })
    material.transparent = true
    let geometry = new PlaneGeometry(width, height)
    let panel = new Mesh(geometry, material)
    panel.position.copy(position)
    super(width, height, panel)
    this.imgSrc = imgSrc
  }
}
/**
 * canvas元素
 */
export class CanvasItem extends Item {
  texture: Texture
  canvas: any
  position: Vector3
  constructor(position: Vector3, width: number, height: number, canvas: any) {
    let texture = new CanvasTexture(canvas)
    texture.needsUpdate = true
    let material = new MeshBasicMaterial({
      map: texture
    })
    material.transparent = true
    let geometry = new PlaneGeometry(width, height)
    let panel = new Mesh(geometry, material)
    panel.position.copy(position)
    super(width, height, panel)
    this.texture = texture
    this.canvas = canvas
    this.position = position
  }
  update(): void {
    if (this.mesh !== undefined) {
      this.texture.needsUpdate = true
    }
  }
}
