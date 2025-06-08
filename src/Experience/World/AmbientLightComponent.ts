import * as kokomi from "kokomi.js";
import * as THREE from "three";

import type Experience from "../Experience";

/**
 * 环境光组件，负责创建和管理场景中的环境光
 */
export default class AmbientLightComponent extends kokomi.Component {
  declare base: Experience;
  params: {
    color: number;
    intensity: number;
  };
  ambiLight: THREE.AmbientLight;
  constructor(base: Experience) {
    super(base);

    // 环境光参数，可用于调试
    this.params = {
      color: 0x0f6eff, // 默认环境光颜色
      intensity: 6, // 默认环境光强度
    };

    // 创建环境光对象
    this.ambiLight = new THREE.AmbientLight(
      this.params.color,
      this.params.intensity
    );

    this.createDebug();
  }
  addExisting(): void {
    this.container.add(this.ambiLight);
  }
  createDebug() {
    const debug = this.base.debug;
    const params = this.params;

    if (debug.active && debug.ui) {
      const debugFolder = debug.ui.addFolder("ambientLight");
      // 调整环境光颜色
      debugFolder.addColor(params, "color").onChange((val: number) => {
        this.ambiLight.color.set(val);
      });
      // 调整环境光强度
      debugFolder.add(params, "intensity", 0, 10).onChange((val: number) => {
        this.ambiLight.intensity = val;
      });
    }
  }
}
