import { Scene, Fog, Color, Camera, OrthographicCamera, PerspectiveCamera } from 'three'
/**
 * 创建通用场景对象工具类
 */
export class CreateUtil {
  static createScene(fog?: Fog | undefined, background?: number | undefined): Scene {
    let scene = new Scene()
    if (fog) {
      scene.fog = fog
    }
    if (background !== undefined) {
      scene.background = new Color(background)
    }
    return scene
  }
  static createFog(hex: number, near?: number | undefined, far?: number | undefined): Fog {
    return new Fog(hex, near, far)
  }
  static createHudCamera(
    left: number,
    right: number,
    top: number,
    bottom: number,
    near?: number | undefined,
    far?: number | undefined
  ): Camera {
    return new OrthographicCamera(left, right, top, bottom, near, far)
  }
  static createPerspectiveCamera(
    fov?: number | undefined,
    aspect?: number | undefined,
    near?: number | undefined,
    far?: number | undefined
  ): Camera {
    return new PerspectiveCamera(fov, aspect, near, far)
  }
}
