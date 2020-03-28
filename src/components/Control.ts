import { Scene, Camera, WebGLRenderer, Object3D } from 'three'

interface StageInterface {
  scene: Scene
  camera: Camera
}
/**
 * main control
 */
export class Control {
  canvas: any
  stage: StageInterface
  hudStage: StageInterface | undefined
  renderer: WebGLRenderer
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
  }

  /**
   * use in animate
   */
  update(): void {
    let { scene, camera } = this.stage
    this.renderer.render(scene, camera)
    if (this.hudStage !== undefined) {
      this.renderer.render(this.hudStage.scene, this.hudStage.camera)
    }
  }
  addMesh(mesh: Object3D): void {
    this.stage.scene.add(mesh)
  }
  addHudMesh(mesh: Object3D): void {
    if (this.hudStage !== undefined) {
      this.hudStage.scene.add(mesh)
    }
  }
  removeMesh(mesh: Object3D): void {
    this.stage.scene.remove(mesh)
  }
  removeHudMesh(mesh: Object3D): void {
    if (this.hudStage !== undefined) {
      this.hudStage.scene.remove(mesh)
    }
  }
}
