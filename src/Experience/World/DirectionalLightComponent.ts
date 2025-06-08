import * as kokomi from "kokomi.js";
import * as THREE from "three";

import type Experience from "../Experience";

/**
 * 平行光（太阳光）组件，负责创建和管理场景中的主光源
 */
export default class DirectionalLightComponent extends kokomi.Component {
  declare base: Experience;
  params: {
    color: number;
    intensity: number;
  };
  dirLight: THREE.DirectionalLight;
  target: THREE.Object3D;
  originPos: THREE.Vector3;
  constructor(base: Experience) {
    super(base);

    // 平行光参数，可用于调试
    this.params = {
      color: 0xff6222,
      intensity: 35,
    };

    const dirLight = new THREE.DirectionalLight(
      this.params.color,
      this.params.intensity
    );
    this.dirLight = dirLight;

    // 启用阴影并设置阴影参数
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.top = 400;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.left = -100;
    dirLight.shadow.camera.right = 400;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 50000;
    dirLight.shadow.bias = -0.00005;

    // 创建光源目标对象
    const target = new THREE.Object3D();
    this.target = target;
    dirLight.target = target;

    // 设置光源初始相对位置
    const originPos = new THREE.Vector3(10000, 0, 6000);
    originPos.y = Math.hypot(originPos.x, originPos.z) / 1.35; // 计算的是这两个分量组成的平面距离（即 xz 平面上的斜边长度）。
    this.originPos = originPos;

    this.createDebug();
  }
  addExisting(): void {
    this.container.add(this.dirLight);
    this.container.add(this.target);
  }
  update(): void {
    // 太阳光要跟随相机的视角
    this.dirLight.position.copy(
      this.base.camera.position.clone().add(this.originPos) // 让平行光（太阳光）的光源位置始终位于相机位置的基础上，加上一个固定的偏移量
    );
    this.dirLight.target.position.copy(this.base.camera.position);
  }
  createDebug() {
    const debug = this.base.debug;
    const params = this.params;

    if (debug.active && debug.ui) {
      const debugFolder = debug.ui.addFolder("directionalLight");
      // 调整光源颜色
      debugFolder.addColor(params, "color").onChange((val: number) => {
        this.dirLight.color.set(val);
      });
      // 调整光照强度
      debugFolder.add(params, "intensity", 0, 50).onChange((val: number) => {
        this.dirLight.intensity = val;
      });
    }
  }
}
