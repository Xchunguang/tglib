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
export class ItemManager {
  control: Control
  items: Item[]
  hudItems: Item[]
  constructor(control: Control) {
    instance = this
    this.control = control
    this.items = []
    this.hudItems = []
    this.initTouchHandler()
  }
  addItem(item: Item): void {
    if (item.mesh !== undefined) {
      instance.items.push(item)
      instance.control.addMesh(item.mesh)
    }
  }
  addHudItem(item: Item): void {
    if (item.mesh !== undefined) {
      instance.hudItems.push(item)
      instance.control.addHudMesh(item.mesh)
    }
  }
  getItem(uuid: string): Item | undefined {
    if (instance.items !== undefined) {
      for (let i = 0; i < instance.items.length; i++) {
        if (instance.items[i].uuid === uuid) {
          return instance.items[i]
        }
      }
    }
    if (instance.hudItems !== undefined) {
      for (let i = 0; i < instance.hudItems.length; i++) {
        if (instance.hudItems[i].uuid === uuid) {
          return instance.hudItems[i]
        }
      }
    }
    return undefined
  }
  remove(uuid: string): void {
    if (instance.items !== undefined) {
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
        }
      }
      return
    }
    if (instance.hudItems !== undefined) {
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
      return
    }
  }
  initTouchHandler(): void {
    instance.control.canvas.addEventListener('touchstart', instance.touchHandler.bind(this))
  }
  removeTouchHandler(): void {
    instance.control.canvas.removeEventListener('touchstart', instance.touchHandler.bind(this))
  }
  touchHandler(e: any): void {
    e.preventDefault()
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    x = (x / window.innerWidth) * 2 - 1
    y = -(y / window.innerHeight) * 2 + 1
    let mouseVector = new Vector3(x, y, 0.5)
    //判断stage中的元素
    if (this.items.length > 0) {
      let raycaster = new Raycaster()
      raycaster.setFromCamera(mouseVector, this.control.stage.camera)
      for (let i = 0; i < this.items.length; i++) {
        let curItem = this.items[i]
        if (curItem.touchEvent && curItem.touchEvent !== null && curItem.mesh !== undefined) {
          let arr = raycaster.intersectObject(curItem.mesh, true)
          if (
            arr !== null &&
            arr.length > 0 &&
            arr[0].object &&
            arr[0].object.uuid &&
            arr[0].object.uuid === curItem.mesh.uuid
          ) {
            curItem.touchEvent()
          }
        }
      }
    }
    //判断hudStage中的元素
    if (instance.hudItems.length > 0 && instance.control.hudStage !== undefined) {
      let hudRaycaster = new Raycaster()
      hudRaycaster.setFromCamera(mouseVector, instance.control.hudStage.camera)
      for (let i = 0; i < instance.hudItems.length; i++) {
        let curItem = instance.hudItems[i]
        if (curItem.touchEvent && curItem.touchEvent !== null && curItem.mesh !== undefined) {
          let arr = hudRaycaster.intersectObject(curItem.mesh, true)
          if (
            arr !== null &&
            arr.length > 0 &&
            arr[0].object &&
            arr[0].object.uuid &&
            arr[0].object.uuid === curItem.mesh.uuid
          ) {
            curItem.touchEvent()
          }
        }
      }
    }
  }
}
export class Item {
  uuid: string | undefined
  width: number | undefined
  height: number | undefined
  mesh: Object3D | undefined
  touchEvent: any
  constructor(width: number, height: number, mesh: Object3D | undefined) {
    this.width = width
    this.height = height
    this.mesh = mesh
    if (mesh !== undefined) {
      this.uuid = mesh.uuid
    }
  }
  setMesh(mesh: Object3D): void {
    this.mesh = mesh
  }
  setTouchEvent(touchEvent: any): void {
    this.touchEvent = touchEvent
  }
  equals(item: Item): boolean {
    return this.uuid === item.uuid
  }
  dispose(): void {
    if (this.mesh !== undefined) {
      this.mesh = undefined
    }
  }
}
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
export class CanvasItem extends Item {
  texture: Texture
  constructor(position: Vector3, width: number, height: number, canvas: any) {
    let texture = new CanvasTexture(canvas)
    let material = new MeshBasicMaterial({
      map: texture
    })
    material.transparent = true
    let geometry = new PlaneGeometry(width, height)
    let panel = new Mesh(geometry, material)
    panel.position.copy(position)
    super(width, height, panel)
    this.texture = texture
  }
  update(): void {
    if (this.mesh !== undefined && this.texture !== undefined) {
      this.texture.needsUpdate = true
    }
  }
}
