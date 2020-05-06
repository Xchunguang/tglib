import { Scene, Camera, WebGLRenderer, Object3D } from 'three'
import { ItemManager } from './ItemManager'

interface StageInterface {
  scene: Scene
  camera: Camera
}
/**
 * 控制中心
 */
export class Control {
  canvas: any
  stage: StageInterface
  hudStage: StageInterface | undefined
  renderer: WebGLRenderer
  itemManager: ItemManager
  /**
   * 初始化
   * @param canvas 唯一上屏canvas
   * @param stage 3D主场景的舞台
   * @param hudStage hud场景的舞台
   */
  constructor(canvas: any, stage: StageInterface, hudStage?: StageInterface | undefined) {
    this.canvas = canvas
    this.stage = stage
    if (hudStage !== undefined) {
      this.hudStage = hudStage
    } else {
      this.hudStage = undefined
    }
    let ctx = canvas.getContext('webgl', { antialias: true, preserveDrawingBuffer: true })
    this.renderer = new WebGLRenderer({ context: ctx, canvas: canvas })
    this.renderer.autoClear = false // 此处关键否则,画布会被重新擦拭
    this.renderer.shadowMap.enabled = true
    if (window.devicePixelRatio) {
      this.renderer.setPixelRatio(window.devicePixelRatio)
    }
    this.itemManager = new ItemManager(this);
  }

  /**
   * 场景帧刷新方法，需要在每个帧循环调用
   */
  update(): void {
    let { scene, camera } = this.stage
    this.renderer.render(scene, camera)
    if (this.hudStage !== undefined) {
      this.renderer.render(this.hudStage.scene, this.hudStage.camera)
    }
  }
  /**
   * 添加元素到主场景
   * @param mesh Object3D
   */
  addMesh(mesh: Object3D): void {
    this.stage.scene.add(mesh)
  }
  /**
   * 添加hud元素
   * @param mesh
   */
  addHudMesh(mesh: Object3D): void {
    if (this.hudStage !== undefined) {
      this.hudStage.scene.add(mesh)
    }
  }
  /**
   * 移除主场景元素
   * @param mesh
   */
  removeMesh(mesh: Object3D): void {
    this.stage.scene.remove(mesh)
  }
  /**
   * 移除hud场景元素
   * @param mesh
   */
  removeHudMesh(mesh: Object3D): void {
    if (this.hudStage !== undefined) {
      this.hudStage.scene.remove(mesh)
    }
  }
}
